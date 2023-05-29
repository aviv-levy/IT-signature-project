const Router = require("express").Router();
const sql = require('../database')
const Database = new sql();

// https://signature.native-data.co.il/securitySign
Router.get('/', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/secutritySign.html')
})

//Insert secuirity sign for user
//https://signature.native-data.co.il/securitySign/security-sign
Router.post('/security-sign', async (req, res) => {
    try {
        let { name, id, department, email, date, pic } = req.body;

        let statement = "SELECT id from securitysigns where id = '" + id + "'";
        let userExistResult = JSON.parse(await Database.selectQuery(statement).catch((err) => { console.error(err) }));
        if (userExistResult[0] === undefined) {
            let statement = "INSERT INTO securitysigns (id,name,date,signature) VALUES ('" + id + "','" + name + "','" + date + "','" + pic + "') "
            await Database.insertUpdateQuery(statement);
        }
        else {
            let statement = "UPDATE securitysigns SET signature = '" + pic + "', date = '" + date + "' WHERE id = " + id + "";
            await Database.insertUpdateQuery(statement)
        }

        let statement2 = "SELECT id from workers where id = '" + id + "'";
        let userExistResult2 = JSON.parse(await Database.selectQuery(statement2).catch((err) => { console.error(err) }));
        //Check if user exist if exists skip it, if not insert it
        if (userExistResult2[0] === undefined) {
            let statement = "INSERT INTO workers (id,name,department,email,securitysign,retired) VALUES ('" + id + "','" + name + "','" + department + "','" + email + "','" + 1 + "','0')";
            await Database.insertUpdateQuery(statement);
        }
        else {
            let statement = "UPDATE workers SET securitysign = " + true + " WHERE id = " + id + "";
            await Database.insertUpdateQuery(statement)
        }

        res.status(201).send('Inserted succesfully');
    } catch (err) {
        res.status(500).send();
    }
})

module.exports = Router;