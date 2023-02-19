const Router = require("express").Router();
const verifyToken = require('../verifyToken')


Router.get('/', verifyToken, (req, res) => {
    res.sendFile('/Users/avivl/Desktop/IT-Signature/IT-signature-project/HTML/left-workers.html')
})

Router.get('/workerDetails', verifyToken, (req, res) => {
    res.sendFile('/Users/avivl/Desktop/IT-Signature/IT-signature-project/HTML/left-workerdetails.html')
})



module.exports = Router;