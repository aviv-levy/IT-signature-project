var mysql = require('mysql');
require('dotenv').config();
const port = 443;
const https = require('https')

const fs = require('fs')
const express = require('express');
const app = express();
const { join } = require("path");
const path = require('path')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { jsPDF } = require('jspdf');
const bodyParser = require('body-parser');
app.use(bodyParser.json())

app.use(express.json());
app.use(cors());

app.set("views", join(__dirname, "views"));
app.use(express.static(__dirname));

const panel = require('./views/panel')
const login = require('./views/login')
const newWorker = require('./views/newWorker')
const securitySign = require('./views/securitySign')
const retiredWorkers = require('./views/retiredWorkers')

//SQL config
let con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

//Email sender config from mrelay
const transporter = nodemailer.createTransport({
  host: 'mrelay.comax.co.il',
  port: 25
})

//user login to panel
app.post('/login', (req, res) => {
  try {
    let { username, password } = req.body;
    if (username === process.env.ADMIN && password === process.env.PASS) {
      //const token = jwt.sign(req.body, process.env.SECRET_TOKEN);
      const token = jwt.sign({ id: username }, process.env.SECRET_TOKEN, { expiresIn: '30m' });
      res.cookie('token', token).send();
    }
    else
      res.status(401).send();
  } catch {
    res.status(500).send();
  }
})

app.post('/checkAuth', (req, res) => {
  try {
    let { token } = req.body;
    jwt.verify(token, process.env.SECRET_TOKEN, null, () => {
      res.status(200).json({ message: 'Authorized' })
    })
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed'
    })
  }
})

//Insert a user to items signs
app.post('/sign', async (req, res) => {
  try {
    let { idworker, workername, date, department, itworker, email, arrItems, computer, phone, other, dataURL, onlyitems } = req.body;
    if (!onlyitems) {
      let statement = "SELECT id from workers where id = '" + idworker + "'";
      let userExistResult = JSON.parse(await selectQuery(statement, con).catch((err) => { console.error(err) }));
      //Check if user exist if exists skip it, if not insert it
      if (userExistResult[0] === undefined) {
        let statement = "INSERT INTO workers (id,name,department,email,securitysign,retired) VALUES ('" + idworker + "','" + workername + "','" + department + "','" + email + "','" + 0 + "','0')";
        await insertUpdateQuery(statement, con);
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
      await insertUpdateQuery(statement, con);
    })
    res.status(201).send('Items were added');
  } catch (err) {
    res.status(500).send(err.message);
  }
})

//Select all workers
app.get('/workers', async (req, res) => {
  try {
    res.status(200).send(await selectQuery("SELECT * FROM workers WHERE retired = 0", con));
  } catch (err) {
    res.status(500).send();
  }
})

//Select all workers who left the work
app.get('/left-workers', async (req, res) => {
  try {
    res.status(200).send(await selectQuery("SELECT * FROM workers WHERE retired = 1", con));
  } catch (err) {
    res.status(500).send();
  }
})

//Select all signs of user
app.post('/items', async (req, res) => {
  try {
    let { idworker } = req.body;
    let security = JSON.parse(await selectQuery("SELECT date,signature FROM securitysigns where id =" + idworker + "", con))
    let items = JSON.parse(await selectQuery("SELECT * FROM items where idworker =" + idworker + "", con))

    res.status(201).send(JSON.stringify({ security: security[0], items: items }));
  } catch (err) {
    res.status(500).send();
  }
})

//Insert secuirity sign for user
app.post('/security-sign', async (req, res) => {
  try {
    let { name, id, department, email, date, pic } = req.body;

    let statement = "SELECT id from securitysigns where id = '" + id + "'";
    let userExistResult = JSON.parse(await selectQuery(statement, con).catch((err) => { console.error(err) }));
    if (userExistResult[0] === undefined) {
      let statement = "INSERT INTO securitysigns (id,name,date,signature) VALUES ('" + id + "','" + name + "','" + date + "','" + pic + "') "
      await insertUpdateQuery(statement, con);
    }
    else {
      let statement = "UPDATE securitysigns SET signature = '" + pic + "', date = '" + date + "' WHERE id = " + id + "";
      await insertUpdateQuery(statement, con)
    }

    let statement2 = "SELECT id from workers where id = '" + id + "'";
    let userExistResult2 = JSON.parse(await selectQuery(statement2, con).catch((err) => { console.error(err) }));
    //Check if user exist if exists skip it, if not insert it
    if (userExistResult2[0] === undefined) {
      let statement = "INSERT INTO workers (id,name,department,email,securitysign,retired) VALUES ('" + id + "','" + name + "','" + department + "','" + email + "','" + 1 + "','0')";
      await insertUpdateQuery(statement, con);
    }
    else {
      let statement = "UPDATE workers SET securitysign = " + true + " WHERE id = " + id + "";
      await insertUpdateQuery(statement, con)
    }

    res.status(201).send('Inserted succesfully');
  } catch (err) {
    res.status(500).send();
  }
})

//Edit worker details
app.put('/editDetails', async (req, res) => {
  try {
    let { newIdworker, workername, department, email, currentIdworker } = req.body;
    let statement = "UPDATE workers SET id = '" + newIdworker + "', name = '" + workername + "', department = '" + department + "', email = '" + email + "' WHERE id = '" + currentIdworker + "'";
    await insertUpdateQuery(statement, con);
    res.status(202).send();
  } catch (err) {
    if (err.errno === 1062)
      res.status(409).send()
    else
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
    await deleteQuery(statement, con, "items returned");
    res.status(204).send('Returned');
  } catch (err) {
    res.status(500).send();
  }
})

//Set workers to retired true
app.put('/delete-workers', async (req, res) => {
  try {
    let { workers_ID } = req.body;
    let statement = "UPDATE workers SET retired = " + true + " WHERE";
    workers_ID.forEach((userid, index) => {
      index !== workers_ID.length - 1 ? statement += ` id = ${userid} ||` : statement += ` id = ${userid}`;
    });
    console.log(statement);

    await deleteQuery(statement, con, "Users deleted");
    res.status(204).send('Deleted');
  } catch (err) {
    res.status(500).send();
  }

})

app.get('/createPDF', (req, res) => {
  const doc = new jsPDF();
  doc.text("Hello world!", 10, 10);
  doc.save('Test.pdf');
  res.status(200).send('hooray')
})




// app.delete('/delete-items', async (req, res) => {
//   try {
//     let { ids } = req.body;
//     console.log(typeof (ids), ids)
//     let statement = "DELETE from items WHERE";
//     if (typeof (ids) === 'string')
//       statement += ` id = ${ids}`
//     else {
//       ids.forEach((itemid, index) => {
//         index !== ids.length - 1 ? statement += ` id = ${itemid} ||` : statement += ` id = ${itemid}`
//       });
//     }
//     await deleteQuery(statement, con, "items deleted");
//     res.status(204).send('Deleted');
//   } catch (err) {
//     res.status(500).send();
//   }
// })




// app.delete('/delete-workers', async (req, res) => {
//   try {
//     let { workers_ID } = req.body;
//     let statement = "DELETE workers,items from workers INNER JOIN items ON workers.id = items.idworker WHERE";
//     let statement2 = "DELETE from workers WHERE";
//     workers_ID.forEach((userid, index) => {
//       index !== workers_ID.length - 1 ? statement += ` workers.id = ${userid} ||` : statement += ` workers.id = ${userid}`;
//       index !== workers_ID.length - 1 ? statement2 += ` id = ${userid} ||` : statement2 += ` id = ${userid}`
//     });
//     console.log(statement);

//     await deleteQuery(statement, con, "Users deleted", statement2);
//     res.status(204).send('Deleted');
//   } catch (err) {
//     res.status(500).send();
//   }

// })

//Send mails
app.post('/sendMail', (req, res) => {
  try {
    let { emails } = req.body;
    emails.forEach((email) => {
      let message = {
        from: "IT@comax.co.il",
        to: email,
        subject: "הודעה חדשה מהמחשוב",
        text: "שלום רב,\n\n עליך לחתום על טופס אבטחת מידע בקישור הבא:\n\n http://it-signatures.native.local/HTML/secutritySign.html\n\n במידה והסתבכתם בחתימה יש לפנות למחשוב למייל it@comax.co.il\n\nבתודה,\nמחלקת המחשוב"
      }
      transporter.sendMail(message, function (err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
      })
    })

  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
})

function selectQuery(statement, con) {
  let myresult = new Promise((resolve) => {
    con.query(statement, function (err, result, fields) {
      if (err) throw err;
      //console.log(result);
      resolve(JSON.stringify(result));
    });
  });
  return myresult;
}

async function insertUpdateQuery(statement, con) {
  return await new Promise((resolve, reject) => con.query(statement, (err, results) => {
    if (err) {
      reject(err)
    } else {
      resolve(results);
    }
  }));
};

async function deleteQuery(statement, con, comment, statement2 = 0) {
  await con.query(statement, function (err, result) {
    if (err) throw err;
    console.log(comment);
  });
  if (statement2 !== 0)
    await con.query(statement2, function (err, result) {
      if (err) throw err;
      console.log(comment);
    });
};


app.use('/panel', panel);
app.use('/login', login);
app.use('/newWorker', newWorker);
app.use('/securitySign', securitySign);
app.use('/retiredWorkers', retiredWorkers);

const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
}, app)


httpsServer.listen(port, () => {
  console.log('Server is running ...');
})


