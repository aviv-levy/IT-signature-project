const Router = require("express").Router();


// https://signature.native-data.co.il/retiredWorkers
Router.get('/', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/left-workers.html')
})

// https://signature.native-data.co.il/retiredWorkers/workerDetails
Router.get('/workerDetails', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/left-workerdetails.html')
})



module.exports = Router;