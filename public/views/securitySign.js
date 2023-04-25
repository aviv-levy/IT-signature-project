const Router = require("express").Router();

Router.get('/', (req, res) => {
    res.sendFile('C:/Users/avivl/Desktop/IT-Signature/IT-signature-project/public/HTML/secutritySign.html')
})


module.exports = Router;