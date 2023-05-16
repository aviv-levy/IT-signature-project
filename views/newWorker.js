const Router = require("express").Router();

// https://signature.native-data.co.il/newWorker
Router.get('/', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/index.html')
})


module.exports = Router;