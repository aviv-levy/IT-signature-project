const Router = require("express").Router();

// https://signature.native-data.co.il/panel
Router.get('/', (req, res) => {
    if (req.permission === 1)
        res.sendFile('/Project/IT-signature-project/HTML/myworkers.html')

    else res.send('ERROR 403: Access denied!')
})


// https://signature.native-data.co.il/panel/workerDetails
Router.get('/workerDetails', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/workerdetails.html')
})



module.exports = Router;