const Router = require("express").Router();
const verifyToken = require('../verifyToken')


Router.get('/', verifyToken, (req, res) => {
    res.sendFile('C:/Users/avivl/Desktop/IT-Signature/IT-signature-project/public/HTML/left-workers.html')
})

Router.get('/workerDetails', verifyToken, (req, res) => {
    res.sendFile('C:/Users/avivl/Desktop/IT-Signature/IT-signature-project/public/HTML/left-workerdetails.html')
})



module.exports = Router;