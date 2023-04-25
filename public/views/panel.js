const Router = require("express").Router();
const verifyToken = require('../verifyToken')


Router.get('/', verifyToken, (req, res) => {
    if (req.permission === 1)
        res.sendFile('C:/Users/avivl/Desktop/IT-Signature/IT-signature-project/public/HTML/myworkers.html')

    else res.send('ERROR 403: Access denied!')
})

Router.get('/workerDetails', verifyToken, (req, res) => {
    res.sendFile('C:/Users/avivl/Desktop/IT-Signature/IT-signature-project/public/HTML/workerdetails.html')
})



module.exports = Router;