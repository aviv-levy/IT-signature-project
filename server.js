require('dotenv').config();
const port = 443;
const https = require('https')
const sql = require('./database')
const Database = new sql();

const fs = require('fs')
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const { join } = require("path");
const path = require('path')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { jsPDF } = require('jspdf');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ limit: '25mb' }));

app.use(cors());

//Block html directory
app.all('/html/*', function (req, res, next) {
    res.status(403).send({
        message: 'Access Forbidden'
    });
});


app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/'));

const panel = require('./views/panel')
const login = require('./views/login')
const newWorker = require('./views/newWorker')
const securitySign = require('./views/securitySign')
const retiredWorkers = require('./views/retiredWorkers')
const HR = require('./views/hr');
const verifyToken = require('./verifyToken');

//Email sender config from mrelay
const transporter = nodemailer.createTransport({
    host: 'mrelay.comax.co.il',
    port: 25
})

//Reirect
app.get('/', (req, res) => {
    try {
        res.redirect('/panel')
    } catch {
        res.status(500).send();
    }
})

//user login to panel
app.post('/login', (req, res) => {
    try {
        let { username, password } = req.body;
        if (username === process.env.ADMIN && password === process.env.PASS) {
            //const token = jwt.sign(req.body, process.env.SECRET_TOKEN);
            const token = jwt.sign({ id: username, permission: 1 }, process.env.SECRET_TOKEN, { expiresIn: '30m' });
            res.cookie('token', token).send(JSON.stringify({ page: 'panel' }));
        }
        else if (username === process.env.HR && password === process.env.HRPASS) {
            const token = jwt.sign({ id: username, permission: 2 }, process.env.SECRET_TOKEN, { expiresIn: '30m' });
            res.cookie('token', token).send(JSON.stringify({ page: 'HR' }));
        }
        else
            res.status(401).send();
    } catch {
        res.status(500).send();
    }
})

//Insert a user to items signs
app.post('/sign', async (req, res) => {
    try {
        let { idworker, workername, date, department, itworker, email, arrItems, computer, phone, other, dataURL, onlyitems } = req.body;
        if (!onlyitems) {
            let statement = "SELECT id from workers where id = '" + idworker + "'";
            let userExistResult = JSON.parse(await Database.selectQuery(statement).catch((err) => { console.error(err) }));
            //Check if user exist if exists skip it, if not insert it
            if (userExistResult[0] === undefined) {
                let statement = "INSERT INTO workers (id,name,department,email,securitysign,retired) VALUES ('" + idworker + "','" + workername + "','" + department + "','" + email + "','" + 0 + "','0')";
                await Database.insertUpdateQuery(statement);
            }
            else
                console.log('user exist');
        }

        JSON.parse(arrItems).forEach(async (item) => {
            let describedItem = "";
            switch (parseInt(item)) {
                case 3:
                    describedItem = computer;
                    break;
                case 4:
                    describedItem = phone;
                    break;
                case 9:
                    describedItem = other;
                    break;
            }
            statement = "INSERT INTO items (idworker,date,itworker,items,describedItem,sign,returned) VALUES ('" + idworker + "','" + date + "','" + itworker + "','" + item + "','" + describedItem + "','" + dataURL + "','0')";
            await Database.insertUpdateQuery(statement);
        })
        res.status(201).send('Items were added');
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//Select all workers
app.get('/workers', async (req, res) => {
    try {
        res.status(200).send(await Database.selectQuery("SELECT * FROM workers WHERE retired = 0"));
    } catch (err) {
        console.log(err.message);
        res.status(500).send();
    }
})

//Select all workers who left the work
app.get('/left-workers', async (req, res) => {
    try {
        res.status(200).send(await Database.selectQuery("SELECT * FROM workers WHERE retired = 1"));
    } catch (err) {
        res.status(500).send();
    }
})

//Select all signs of user
app.post('/items', async (req, res) => {
    try {
        let { idworker } = req.body;
        let security = JSON.parse(await Database.selectQuery("SELECT date,signature FROM securitysigns where id =" + idworker + ""))
        let items = JSON.parse(await Database.selectQuery("SELECT * FROM items where idworker =" + idworker + ""))

        res.status(201).send(JSON.stringify({ security: security[0], items: items }));
    } catch (err) {
        res.status(500).send();
    }
})

//Insert secuirity sign for user
app.post('/security-sign', async (req, res) => {
    try {
        let { name, id, department, email, date, pic } = req.body;

        let statement = "SELECT id from securitysigns where id = '" + id + "'";
        let userExistResult = JSON.parse(await Database.selectQuery(statement).catch((err) => { console.error(err) }));
        if (userExistResult[0] === undefined) {
            let statement = "INSERT INTO securitysigns (id,name,date,signature) VALUES ('" + id + "','" + name + "','" + date + "','" + pic + "') "
            await Database.insertUpdateQuery(statement);
        }
        else {
            let statement = "UPDATE securitysigns SET signature = '" + pic + "', date = '" + date + "' WHERE id = " + id + "";
            await Database.insertUpdateQuery(statement)
        }

        let statement2 = "SELECT id from workers where id = '" + id + "'";
        let userExistResult2 = JSON.parse(await Database.selectQuery(statement2).catch((err) => { console.error(err) }));
        //Check if user exist if exists skip it, if not insert it
        if (userExistResult2[0] === undefined) {
            let statement = "INSERT INTO workers (id,name,department,email,securitysign,retired) VALUES ('" + id + "','" + name + "','" + department + "','" + email + "','" + 1 + "','0')";
            await Database.insertUpdateQuery(statement);
        }
        else {
            let statement = "UPDATE workers SET securitysign = " + true + " WHERE id = " + id + "";
            await Database.insertUpdateQuery(statement)
        }

        res.status(201).send('Inserted succesfully');
    } catch (err) {
        res.status(500).send();
    }
})

//Edit worker details
app.put('/editDetails', async (req, res) => {
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

//Delete items of user
app.put('/delete-items', async (req, res) => {
    try {
        let { ids } = req.body;
        console.log(typeof (ids), ids)
        let statement = "UPDATE items SET returned = " + true + " WHERE";
        if (typeof (ids) === 'string')
            statement += ` id = ${ids}`
        else {
            ids.forEach((itemid, index) => {
                index !== ids.length - 1 ? statement += ` id = ${itemid} ||` : statement += ` id = ${itemid}`
            });
        }
        await Database.deleteQuery(statement, "items returned");
        res.status(204).send('Returned');
    } catch (err) {
        res.status(500).send();
    }
})

//Set workers to retired true
app.put('/delete-workers', async (req, res) => {
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

app.get('/createPDF/:id', async (req, res) => {
    try {
        const ID = req.params.id;
        let statement = `Select * from HR_Secret_Vacation WHERE id = ${ID}`
        const results = JSON.parse(await Database.selectQuery(statement))[0];

        const url = `file://C:/Project/IT-signature-project/HTML/HR/PDF-Templates/secretForm.html`

        const browser = await puppeteer.launch({
            headless: true
        });

        //better than goto method if not working good
        // var contentHtml = fs.readFileSync(url, 'utf8');
        // await page.setContent(contentHtml);
        // await page.addStyleTag({path: './CSS/secretForm.css'})
        const page = await browser.newPage();
        page.goto(url);
        await page.waitForSelector('input[name=name]');
        await page.$eval('input[name=name]', (el, results) => el.value = results, results.name);
        await page.$eval('input[name=id]', (el, results) => el.value = results, results.id);
        await page.$eval('input[name=date]', (el, results) => el.value = results, results.date);
        await page.evaluate((arg) => {
            return document.getElementById("signature").src = arg;
        }, results.secretSign);
        await page.pdf({ path: `./PDF/${results.id}.pdf`, width: "1200px" })
        console.log('done');
        res.status(200).download(`./PDF/${results.id}.pdf`, function (err) {
            if (err)
                console.log(err);

            fs.unlinkSync(`./PDF/${results.id}.pdf`, function () {
                console.log('File was deleted');
            });

        })
    } catch (err) {
        console.log(err.message);
    }
})


app.get('/createPDF_Vacation/:id', async (req, res) => {
    try {
        const ID = req.params.id;
        let statement = `Select * from HR_Secret_Vacation WHERE id = ${ID}`
        const results = JSON.parse(await Database.selectQuery(statement))[0];

        const url = `file://C:/Project/IT-signature-project/HTML/HR/PDF-Templates/vacationForm.html`

        const browser = await puppeteer.launch({
            headless: true
        });

        //better than goto method if not working good
        // var contentHtml = fs.readFileSync(url, 'utf8');
        // await page.setContent(contentHtml);
        // await page.addStyleTag({path: './CSS/secretForm.css'})
        const page = await browser.newPage();
        page.goto(url);
        await page.waitForSelector('input[name=name]');
        await page.$eval('input[name=name]', (el, results) => el.value = results, results.name);
        await page.evaluate((arg) => {
            return document.getElementById("signature").src = arg;
        }, results.vacationSign);
        await page.pdf({ path: `./PDF/${results.id}.pdf`, width: "1200px" })
        console.log('done');
        res.status(200).download(`./PDF/${results.id}.pdf`, function (err) {
            if (err)
                console.log(err);

            fs.unlinkSync(`./PDF/${results.id}.pdf`, function () {
                console.log('File was deleted');
            });

        })
    } catch (err) {
        console.log(err.message);
    }
})


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

//Send mails
app.post('/sendMail', (req, res) => {
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


app.use('/panel',verifyToken, panel);
app.use('/login', login);
app.use('/newWorker',verifyToken, newWorker);
app.use('/securitySign', securitySign);
app.use('/retiredWorkers',verifyToken, retiredWorkers);
app.use('/HR', verifyToken, HR);

const httpsServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)


app.listen(80, () => { })

httpsServer.listen(port, () => {
    console.log('Server is running ...');
})


