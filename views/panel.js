const Router = require("express").Router();
const nodemailer = require('nodemailer');
const sql = require('../database')
const Database = new sql();
const CsvParser = require('json2csv').Parser;


//Email sender config from mrelay
const transporter = nodemailer.createTransport({
    host: 'mrelay.comax.co.il',
    port: 25
})

// View Panel page
// https://signature.native-data.co.il/panel
Router.get('/', (req, res) => {
    if (req.permission === 1)
        res.sendFile('/Project/IT-signature-project/HTML/myworkers.html')

    else res.send('ERROR 403: Access denied!')
})

// Select all workers
// https://signature.native-data.co.il/panel/workers
Router.get('/workers', async (req, res) => {
    try {
        res.status(200).send(await Database.selectQuery("SELECT * FROM workers WHERE retired = 0"));
    } catch (err) {
        console.log(err.message);
        res.status(500).send();
    }
})

// Edit worker details
// https://signature.native-data.co.il/panel/editDetails
Router.put('/editDetails', async (req, res) => {
    try {
        let { newIdworker, workername, department, email, currentIdworker } = req.body;
        let statement = "UPDATE workers SET id = '" + newIdworker + "', name = '" + workername + "', department = '" + department + "', email = '" + email + "' WHERE id = '" + currentIdworker + "'";
        await Database.insertUpdateQuery(statement);
        res.status(202).send();
    } catch (err) {
        if (err.errno === 1062)
            res.status(409).send()
        else
            res.status(500).send();
    }
})


// Set workers to retired true
// https://signature.native-data.co.il/panel/delete-workers
Router.put('/delete-workers', async (req, res) => {
    try {
        let { workers_ID } = req.body;
        let statement = "UPDATE workers SET retired = " + true + " WHERE";
        workers_ID.forEach((userid, index) => {
            index !== workers_ID.length - 1 ? statement += ` id = ${userid} ||` : statement += ` id = ${userid}`;
        });
        console.log(statement);

        await Database.deleteQuery(statement, "Users deleted");
        res.status(204).send('Deleted');
    } catch (err) {
        res.status(500).send();
    }
})

// Send mails
// https://signature.native-data.co.il/panel/sendMail
Router.post('/sendMail', (req, res) => {
    try {
        let { emails } = req.body;
        emails.forEach((email) => {
            let message = {
                from: "IT@comax.co.il",
                to: email,
                subject: "הודעה חדשה מהמחשוב",
                text: "שלום רב,\n\n כחלק מתהליך שיפור לאבטחת מידע שלחנו טופס אבטחת מידע בקישור הבא:\n\n https://signature.native-data.co.il/securitySign\n\n עליכם לקרוא ולפעול לפי מדיניות החברה.\n\n לאחר קריאת הטופס יש לחתום בתחתית העמוד שהבנתם כל מה שרשום בטופס.\n\n במידה והסתבכתם יש לפנות למחשוב למייל it@comax.co.il\n\nבתודה,\nמחלקת המחשוב"
            }
            transporter.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info);
                }
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})


// Export selected workers to csv file
// https://signature.native-data.co.il/panel/Export2csv/SignaturesReport

Router.get('/Export2csv/:ids/SignaturesReport', async (req, res) => {
    try {
        const IDs = req.params.ids;

        const statement = `SELECT id,name,department,email,securitysign FROM WORKERS WHERE id IN (${IDs})`
        let workers = await Database.selectQuery(statement);
        workers = JSON.parse(workers)

        workers.forEach(worker => worker.securitysign === 0 ? worker.securitysign = 'לא חתום' : worker.securitysign = 'חתום')

        const csvFields = ['מספר עובד', 'שם עובד', 'מחלקה', 'מייל', 'חתום'];
        const csvParser = new CsvParser({ data: csvFields, withBOM: true });
        const csvData = csvParser.parse(workers);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment: filename=SignaturesReport.csv");

        res.status(200).send(csvData);

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})


// View worker details page
// https://signature.native-data.co.il/panel/workerDetails
Router.get('/workerDetails', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/workerdetails.html')
})

// Reset all securitySign of the workers
// https://signature.native-data.co.il/panel/workerDetails
Router.put('/resetSigns', async (req, res) => {
    try {

        const statement = "UPDATE workers SET securitysign = 0 WHERE id > 0"
        await Database.insertUpdateQuery(statement);

    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
})



module.exports = Router;










// app.delete('/delete-items', async (req, res) => {
//   try {
//     let { ids } = req.body;
//     console.log(typeof (ids), ids)
//     let statement = "DELETE from items WHERE";
//     if (typeof (ids) === 'string')
//       statement += ` id = ${ids}`
//     else {
//       ids.forEach((itemid, index) => {
//         index !== ids.length - 1 ? statement += ` id = ${itemid} ||` : statement += ` id = ${itemid}`
//       });
//     }
//     await deleteQuery(statement, "items deleted");
//     res.status(204).send('Deleted');
//   } catch (err) {
//     res.status(500).send();
//   }
// })




// app.delete('/delete-workers', async (req, res) => {
//   try {
//     let { workers_ID } = req.body;
//     let statement = "DELETE workers,items from workers INNER JOIN items ON workers.id = items.idworker WHERE";
//     let statement2 = "DELETE from workers WHERE";
//     workers_ID.forEach((userid, index) => {
//       index !== workers_ID.length - 1 ? statement += ` workers.id = ${userid} ||` : statement += ` workers.id = ${userid}`;
//       index !== workers_ID.length - 1 ? statement2 += ` id = ${userid} ||` : statement2 += ` id = ${userid}`
//     });
//     console.log(statement);

//     await deleteQuery(statement, "Users deleted", statement2);
//     res.status(204).send('Deleted');
//   } catch (err) {
//     res.status(500).send();
//   }

// })
