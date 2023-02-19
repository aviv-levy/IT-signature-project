const Router = require("express").Router();

Router.get('/', (req,res)=>{
    res.sendFile('/Users/avivl/Desktop/IT-Signature/IT-signature-project/HTML/login.html')
})


module.exports = Router;