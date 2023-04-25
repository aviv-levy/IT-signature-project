const Router = require("express").Router();
const verifyToken = require('../verifyToken')

Router.get('/', verifyToken, (req, res) => {
    res.sendFile('C:/Users/avivl/Desktop/IT-Signature/IT-signature-project/public/HTML/index.html')
})


module.exports = Router;