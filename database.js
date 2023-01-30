var mysql = require('mysql');
require('dotenv').config();
const port = 8080;

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json())

app.use(express.json());
app.use(cors());

let con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

//user login to panel
app.post('/login', async (req, res) => {
  let { username, password } = req.body;
  if (username === process.env.ADMIN && password === process.env.PASS) {
    const token = jwt.sign(username, process.env.SECRET_TOKEN);
    res.json({ token: token, expires: new Date(new Date().getTime() + 1 * 30 * 1000) });
  }
  else {
    res.status(500).send();
  }
})

app.post('/checkAuth', async (req, res) => {
  try {
    let { token } = req.body;
    jwt.verify(token, process.env.SECRET_TOKEN, null, () => {
    res.status(200).json({message: 'Authorized'});
    })
  } catch (error) {
    res.status(401).json({
      message: 'Auth failed'
    })
  }
})

//Insert a user to items signs
app.post('/sign', async (req, res) => {
  let { idworker, workername, date, department, itworker, email, arrItems, computer, phone, other, dataURL, onlyitems } = req.body;

  if (!onlyitems) {
    let statement = "SELECT id from workers where id = '" + idworker + "'";
    let userExistResult = JSON.parse(await selectQuery(statement, con).catch((err) => { console.error(err) }));
    //Check if user exist if exists skip it, if not insert it
    if (userExistResult[0] === undefined) {
      let statement = "INSERT INTO workers (id,name,department,email,securitysign) VALUES ('" + idworker + "','" + workername + "','" + department + "','" + email + "','" + 0 + "')";
      insertQuery(statement, con);
    }
    else
      console.log('user exist');
  }

  JSON.parse(arrItems).forEach((item) => {
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
    statement = "INSERT INTO items (idworker,date,itworker,items,describedItem,sign) VALUES ('" + idworker + "','" + date + "','" + itworker + "','" + item + "','" + describedItem + "','" + dataURL + "')";
    insertQuery(statement, con)
  })
})

//Select all workers
app.get('/workers', async (req, res) => {
  res.end(await selectQuery("SELECT * FROM workers", con));
})

//Select all signs of user
app.post('/items', async (req, res) => {
  let { idworker } = req.body;
  let security = JSON.parse(await selectQuery("SELECT date,signature FROM securitysigns where id =" + idworker + "", con))
  let items = JSON.parse(await selectQuery("SELECT * FROM items where idworker =" + idworker + "", con))

  res.end(JSON.stringify({ security: security[0], items: items }));
})

//Insert secuirity sign for user
app.post('/security-sign', async (req, res) => {
  let { name, id, department, email, date, pic } = req.body;

  let statement = "SELECT id from securitysigns where id = '" + id + "'";
  let userExistResult = JSON.parse(await selectQuery(statement, con).catch((err) => { console.error(err) }));
  if (userExistResult[0] === undefined) {
    let statement = "INSERT INTO securitysigns (id,name,date,signature) VALUES ('" + id + "','" + name + "','" + date + "','" + pic + "') "
    insertQuery(statement, con);
  }

  let statement2 = "SELECT id from workers where id = '" + id + "'";
  let userExistResult2 = JSON.parse(await selectQuery(statement2, con).catch((err) => { console.error(err) }));
  //Check if user exist if exists skip it, if not insert it
  if (userExistResult2[0] === undefined) {
    let statement = "INSERT INTO workers (id,name,department,email,securitysign) VALUES ('" + id + "','" + name + "','" + department + "','" + email + "','" + 1 + "')";
    insertQuery(statement, con);
  }
  else {
    let statement = "UPDATE workers SET securitysign = " + true + " WHERE id = " + id + "";
    updateQuery(statement, con)
  }
})

//Delete items of user
app.delete('/delete-items', async (req, res) => {
  let { ids } = req.body;
  console.log(typeof (ids), ids)
  let statement = "DELETE from items WHERE";
  if (typeof (ids) === 'string')
    statement += ` id = ${ids}`
  else {
    ids.forEach((itemid, index) => {
      index !== ids.length - 1 ? statement += ` id = ${itemid} ||` : statement += ` id = ${itemid}`
    });
  }
  await deleteQuery(statement, con, "items deleted");
})

app.delete('/delete-workers', async (req, res) => {
  let { workers_ID } = req.body;
  let statement = "DELETE workers,items from workers INNER JOIN items ON workers.id = items.idworker WHERE";
  let statement2 = "DELETE from workers WHERE";
  workers_ID.forEach((userid, index) => {
    index !== workers_ID.length - 1 ? statement += ` workers.id = ${userid} ||` : statement += ` workers.id = ${userid}`;
    index !== workers_ID.length - 1 ? statement2 += ` id = ${userid} ||` : statement2 += ` id = ${userid}`
  });
  console.log(statement);

  await deleteQuery(statement, con, "Users deleted", statement2);

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

function insertQuery(statement, con) {
  con.query(statement, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
};

function updateQuery(statement, con) {
  con.query(statement, function (err, result) {
    if (err) throw err;
    console.log("1 record updated");
  });
};

function deleteQuery(statement, con, comment, statement2 = 0) {
  con.query(statement, function (err, result) {
    if (err) throw err;
    console.log(comment);
  });
  if (statement2 !== 0)
    con.query(statement2, function (err, result) {
      if (err) throw err;
      console.log(comment);
    });
};


app.listen(port, () => {
  console.log('Server is listening');
})


