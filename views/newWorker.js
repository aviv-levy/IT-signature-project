const Router = require("express").Router();
const sql = require('../database')
const Database = new sql();

// https://signature.native-data.co.il/newWorker
Router.get('/', (req, res) => {
    res.sendFile('/Project/IT-signature-project/HTML/index.html')
})

//Insert a user to items signs
Router.post('/sign', async (req, res) => {
    try {
        let { idworker, workername, date, department, itworker, email, arrItems, computer, phone, other, dataURL, onlyitems } = req.body;
        if (!onlyitems) {
            let statement = "SELECT id from workers where id = '" + idworker + "'";
            let userExistResult = JSON.parse(await Database.selectQuery(statement).catch((err) => { console.error(err) }));
            //Check if user exist if exists skip it, if not insert it
            if (userExistResult[0] === undefined) {
                let statement = "INSERT INTO workers (id,name,department,email,securitysign,retired) VALUES ('" + idworker + "','" + workername + "','" + department + "','" + email + "','" + 0 + "','0')";
                await Database.insertUpdateQuery(statement);
            }
            else
                console.log('user exist');
        }

        JSON.parse(arrItems).forEach(async (item) => {
            let describedItem = "";
            switch (parseInt(item)) {
                case 3:
                    describedItem = computer;
                    break;
                case 4:
                    describedItem = phone;
                    break;
                case 9:
                    describedItem = other;
                    break;
            }
            statement = "INSERT INTO items (idworker,date,itworker,items,describedItem,sign,returned) VALUES ('" + idworker + "','" + date + "','" + itworker + "','" + item + "','" + describedItem + "','" + dataURL + "','0')";
            await Database.insertUpdateQuery(statement);
        })
        res.status(201).send('Items were added');
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = Router;