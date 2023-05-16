const Router = require("express").Router();
const sql = require('../database');
const Database = new sql();

// https://signature.native-data.co.il/hr
Router.get('/', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/HR/hrPanel.html')
})

// https://signature.native-data.co.il/hr/getWorkers
Router.get('/getWorkers', async (req, res) => {
    try {
        let statement = "SELECT * from HR_Secret_Vacation";
        res.status(200).json(await Database.selectQuery(statement).catch((err) => { console.error(err) }))
    } catch (err) {
        res.status(500).send();
        console.log(err.message);
    }
})

// https://signature.native-data.co.il/hr/secretForm
Router.get('/secretForm', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/HR/secretForm.html')
})

// https://signature.native-data.co.il/hr/getWorkers/secretForm/sign
Router.post('/secretForm/sign', async (req, res) => {
    try {
        let { id, workername, date, signature } = req.body;
        console.log(workername);
        let statement = "INSERT INTO HR_Secret_Vacation (id,name,date,secretSign) VALUES ('" + id + "','" + workername + "','" + date + "','" + signature + "')";
        await Database.insertUpdateQuery(statement);
        res.status(201).send();
    } catch (err) {
        if (err.errno === 1062)
            res.status(409).send()
        else {
            console.log(err.message);
            res.status(500).send();
        }
    }
})

// https://signature.native-data.co.il/hr/getWorkers/vacationForm
Router.get('/vacationForm', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/HR/vacationForm.html')
})

// https://signature.native-data.co.il/hr/getWorkers/vacationForm/sign
Router.put('/vacationForm/sign', async (req, res) => {
    try {
        let { id, signature } = req.body;
        let statement = "UPDATE HR_Secret_Vacation SET vacationSign = '" + signature + "' WHERE id = " + id + "";
        await Database.insertUpdateQuery(statement)
        res.status(202).send();
    } catch (err) {
        res.status(500).send();
        console.log(err.message);
    }
})


module.exports = Router;