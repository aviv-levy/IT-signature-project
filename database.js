var mysql = require('mysql');

const port = 8080;

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/',async function (req, res) {
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
    let security = JSON.parse(await selectQuery("SELECT date,signature FROM securitysigns where id ="+workerData+"", con))
    let items = JSON.parse(await selectQuery("SELECT * FROM items where idworker ="+workerData+"",con))
    
    res.end(JSON.stringify({security:security[0],items:items}));
  }


  //Insert a user to items signs
  else if (clientRequest === '2') {
    let workerData = JSON.parse(decodeURI(clientRequestObject)); //Decode for UTF-8

    let statement = "SELECT id from workers where id = '" + workerData.idworker + "'";
    let userExistResult = JSON.parse(await selectQuery(statement, con).catch((err) => { console.error(err) }));
    //Check if user exist if exists skip it, if not insert it
    if (userExistResult[0] === undefined) {
      let statement = "INSERT INTO workers (id,name,department) VALUES ('" + workerData.idworker + "','" + workerData.workername + "','" + workerData.department + "')";
      insertQuery(statement, con);
    }
    else
      console.log('user exist');

    statement = "INSERT INTO items (idworker,date,itworker,items,computer,phone,other,sign) VALUES ('" + workerData.idworker + "','" + workerData.date + "','" + workerData.itworker + "','" + workerData.arrItems + "','" + workerData.computer + "','" + workerData.phone + "','"+workerData.other+"','" + workerData.dataURL + "')";
    insertQuery(statement, con)
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

    if(clientRequest === '5'){
      let workerDatadecode = JSON.parse(decodeURI(clientRequestObject));
      let statement = "DELETE FROM workers where";
      workerDatadecode.forEach((userid,index) => {
        index !== workerDatadecode.length-1 ? statement+=` id = ${userid} ||` : statement+=` id = ${userid}`
      });
      console.log(statement);
      await deleteQuery(statement, con);
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

function deleteQuery(statement, con) {
  con.query(statement, function (err, result) {
    if (err) throw err;
    console.log("Users deleted");
  });
};


app.listen(port,()=>{
  console.log('Server is listening');
})


