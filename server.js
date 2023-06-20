require('dotenv').config();
const port = 443;
const https = require('https')
const sql = require('./database')
const Database = new sql();

const fs = require('fs')
const express = require('express');
const app = express();
const { join } = require("path");
const path = require('path')
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ limit: '25mb' }));

app.use(cors());

//Block html directory
app.all('/html/*', function (req, res, next) {
    res.status(403).send({
        message: 'Access Forbidden'
    });
});


app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/'));

const panel = require('./views/panel')
const login = require('./views/login')
const newWorker = require('./views/newWorker')
const securitySign = require('./views/securitySign')
const retiredWorkers = require('./views/retiredWorkers')
const HR = require('./views/hr');
const verifyToken = require('./verifyToken');

//Reirect to panel if goes to root
app.get('/', (req, res) => {
    try {
        res.redirect('/panel')
    } catch {
        res.status(500).send();
    }
})

//Select all signs of user
app.post('/items', async (req, res) => {
    try {
        let { idworker } = req.body;
        let security = JSON.parse(await Database.selectQuery("SELECT date,signature FROM securitysigns where id =" + idworker + ""))
        let items = JSON.parse(await Database.selectQuery("SELECT * FROM items where idworker =" + idworker + ""))
        let retiredDate = JSON.parse(await Database.selectQuery("SELECT retiredDate FROM workers where id =" + idworker + ""))
        res.status(201).send(JSON.stringify({ security: security[0], items: items, retiredDate: retiredDate[0].retiredDate }));
    } catch (err) {
        res.status(500).send();
    }
})

//Delete items of user
app.put('/delete-items', async (req, res) => {
    try {
        let { ids } = req.body;
        console.log(typeof (ids), ids)
        let statement = "UPDATE items SET returned = " + true + " WHERE";
        if (typeof (ids) === 'string')
            statement += ` id = ${ids}`
        else {
            ids.forEach((itemid, index) => {
                index !== ids.length - 1 ? statement += ` id = ${itemid} ||` : statement += ` id = ${itemid}`
            });
        }
        await Database.deleteQuery(statement, "items returned");
        res.status(204).send('Returned');
    } catch (err) {
        res.status(500).send();
    }
})



app.use('/panel', verifyToken, panel);
app.use('/login', login);
app.use('/newWorker', verifyToken, newWorker);
app.use('/securitySign', securitySign);
app.use('/retiredWorkers', verifyToken, retiredWorkers);
app.use('/HR', verifyToken, HR);

const httpsServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)


httpsServer.listen(port, () => {
    console.log('Server is running ...');
})


