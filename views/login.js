const Router = require("express").Router();
const jwt = require('jsonwebtoken');

// Show page
// https://signature.native-data.co.il/login
Router.get('/', (req,res)=>{
    res.sendFile('/Project/IT-signature-project/HTML/login.html')
})


// user login to panel
// https://signature.native-data.co.il/login
Router.post('/', (req, res) => {
    try {
        let { username, password } = req.body;
        if (username === process.env.ADMIN && password === process.env.PASS) {
            //const token = jwt.sign(req.body, process.env.SECRET_TOKEN);
            const token = jwt.sign({ id: username, permission: 1 }, process.env.SECRET_TOKEN, { expiresIn: '30m' });
            res.cookie('token', token).send(JSON.stringify({ page: 'panel' }));
        }
        else if (username === process.env.HR && password === process.env.HRPASS) {
            const token = jwt.sign({ id: username, permission: 2 }, process.env.SECRET_TOKEN, { expiresIn: '30m' });
            res.cookie('token', token).send(JSON.stringify({ page: 'HR' }));
        }
        else
            res.status(401).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
})


module.exports = Router;