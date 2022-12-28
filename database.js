var mysql = require('mysql');

const port = 8080;

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/', async function (req, res) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  res.writeHead(200);
  clientRequest = req.headers['1'];//read key from all
  let clientRequestObject = req.headers['2'];// read key with a value of object

  let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "myworkers"
  });

  //Select all from users
  if (clientRequest === '1') {
    res.end(await selectQuery("SELECT * FROM workers", con));
  }

  //Select all signs of user
  else if (clientRequest === '3') {
    let workerData = JSON.parse(decodeURI(clientRequestObject)); //Decode for UTF-8
    let security = JSON.parse(await selectQuery("SELECT date,signature FROM securitysigns where id =" + workerData + "", con))
    let items = JSON.parse(await selectQuery("SELECT * FROM items where idworker =" + workerData + "", con))

    res.end(JSON.stringify({ security: security[0], items: items }));
  }


  //Insert a user to items signs
  else if (clientRequest === '2') {
    let workerData = JSON.parse(decodeURI(clientRequestObject)); //Decode for UTF-8

    console.log(workerData);

    if (!workerData.onlyitems) {
      let statement = "SELECT id from workers where id = '" + workerData.idworker + "'";
      let userExistResult = JSON.parse(await selectQuery(statement, con).catch((err) => { console.error(err) }));
      //Check if user exist if exists skip it, if not insert it
      if (userExistResult[0] === undefined) {
        let statement = "INSERT INTO workers (id,name,department) VALUES ('" + workerData.idworker + "','" + workerData.workername + "','" + workerData.department + "')";
        insertQuery(statement, con);
      }
      else
        console.log('user exist');
    }

    JSON.parse(workerData.arrItems).forEach((item) => {
      let describedItem = "";
      switch (parseInt(item)) {
        case 3:
          describedItem = workerData.computer;
          break;
        case 4:
          describedItem = workerData.phone;
          break;
        case 9:
          describedItem = workerData.other;
          break;
      }
      statement = "INSERT INTO items (idworker,date,itworker,items,describedItem,sign) VALUES ('" + workerData.idworker + "','" + workerData.date + "','" + workerData.itworker + "','" + item + "','" + describedItem + "','" + workerData.dataURL + "')";
      insertQuery(statement, con)
    })
  }

  //Insert a user to security signatures if not exist
  else if (clientRequest === '4') {
    let workerData = JSON.parse(decodeURI(clientRequestObject));//Decode for UTF-8

    let statement = "SELECT id from securitysigns where id = '" + workerData.id + "'";
    let userExistResult = JSON.parse(await selectQuery(statement, con).catch((err) => { console.error(err) }));
    if (userExistResult[0] === undefined) {
      let statement = "INSERT INTO securitysigns (id,name,date,signature) VALUES ('" + workerData.id + "','" + workerData.name + "','" + workerData.date + "','" + workerData.pic + "') "
      insertQuery(statement, con);
    }

    let statement2 = "SELECT id from workers where id = '" + workerData.id + "'";
    let userExistResult2 = JSON.parse(await selectQuery(statement2, con).catch((err) => { console.error(err) }));
    //Check if user exist if exists skip it, if not insert it
    if (userExistResult2[0] === undefined) {
      let statement = "INSERT INTO workers (id,name,department) VALUES ('" + workerData.id + "','" + workerData.name + "','" + workerData.department + "')";
      insertQuery(statement, con);
    }
  }

  if (clientRequest === '5') {
    let workerData = JSON.parse(decodeURI(clientRequestObject));
    let statement = "DELETE workers,items from workers INNER JOIN items ON workers.id = items.idworker WHERE";
    let statement2 = "DELETE from workers WHERE";
    workerData.forEach((userid, index) => {
      index !== workerData.length - 1 ? statement += ` workers.id = ${userid} ||` : statement += ` workers.id = ${userid}`;
      index !== workerData - 1 ? statement2 += ` id = ${userid} ||` : statement2 += ` id = ${userid}`
    });
    console.log(statement);
    await deleteQuery(statement, con, "Users deleted", statement2);
  }

  else if (clientRequest === '6') {
    let workerData = JSON.parse(decodeURI(clientRequestObject));
    console.log(typeof (workerData), workerData)
    let statement = "DELETE from items WHERE";
    if (typeof (workerData) === 'string')
      statement += ` id = ${workerData}`
    else {
      workerData.forEach((itemid, index) => {
        index !== workerData.length - 1 ? statement += ` id = ${itemid} ||` : statement += ` id = ${itemid}`
      });
    }
    await deleteQuery(statement, con, "items deleted");
  }
});



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

function deleteQuery(statement, con, comment, statement2 = 0) {
  con.connect();
  con.query(statement, function (err, result) {
    if (err) throw err;
    console.log(comment);
  });
  if (statement2 !== 0)
    con.query(statement2, function (err, result) {
      if (err) throw err;
      console.log(comment);
    });
  con.end();
};


app.listen(port, () => {
  console.log('Server is listening');
})


