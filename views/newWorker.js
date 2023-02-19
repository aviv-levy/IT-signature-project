const Router = require("express").Router();
const verifyToken = require('../verifyToken')

Router.get('/', verifyToken, (req, res) => {
    res.sendFile('/Users/avivl/Desktop/IT-Signature/IT-signature-project/HTML/index.html')
})


module.exports = Router;