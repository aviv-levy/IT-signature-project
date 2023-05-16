const Router = require("express").Router();

// https://signature.native-data.co.il/securitySign
Router.get('/', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/secutritySign.html')
})


module.exports = Router;