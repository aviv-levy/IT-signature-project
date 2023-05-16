const Router = require("express").Router();

// https://signature.native-data.co.il/login
Router.get('/', (req,res)=>{
    res.sendFile('/Project/IT-signature-project/HTML/login.html')
})


module.exports = Router;