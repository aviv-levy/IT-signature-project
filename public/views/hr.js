const Router = require("express").Router();
const sql = require('../database');
const Database = new sql();

Router.get('/', (req, res) => {
    res.sendFile('C:/Users/avivl/Desktop/IT-Signature/IT-signature-project/public/HTML/HR/hrPanel.html')
})

Router.get('/getWorkers', async (req, res) => {
    try {
        let statement = "SELECT * from HR_Secret_Vacation";
        res.status(200).json(await Database.selectQuery(statement).catch((err) => { console.error(err) }))
    } catch (err) {
        res.status(500).send();
        console.log(err.message);
    }
})

Router.get('/secretForm', (req, res) => {
    res.sendFile('C:/Users/avivl/Desktop/IT-Signature/IT-signature-project/public/HTML/HR/secretForm.html')
})

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

Router.get('/vacationForm', (req, res) => {
    res.sendFile('C:/Users/avivl/Desktop/IT-Signature/IT-signature-project/public/HTML/HR/vacationForm.html')
})

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