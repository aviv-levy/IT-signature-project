const Router = require("express").Router();
const sql = require('../database')
const Database = new sql();

// https://signature.native-data.co.il/retiredWorkers
Router.get('/', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/left-workers.html')
})

// https://signature.native-data.co.il/retiredWorkers/workerDetails
Router.get('/workerDetails', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/left-workerdetails.html')
})

//Select all workers who left the work
//https://signature.native-data.co.il/retiredWorkers/left-workers
Router.get('/left-workers', async (req, res) => {
    try {
        res.status(200).send(await Database.selectQuery("SELECT * FROM workers WHERE retired = 1"));
    } catch (err) {
        res.status(500).send();
    }
})

module.exports = Router;