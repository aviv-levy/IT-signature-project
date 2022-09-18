var mysql = require('mysql');


const http = require('http');


const requestListener = async function (req, res) {
  res.writeHead(200);
  clientRequest = req.headers['1'];//read key from all
  let clientRequestInsert = req.headers['2'];// read key with a value to insert a user

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

  else if (clientRequest === '3') {
    let workerDatadecode = decodeURI(clientRequestInsert); //Decode for UTF-8
    let workerData = JSON.parse(workerDatadecode);
    let security = JSON.parse(await selectQuery("SELECT date,signature FROM securitysigns where id ="+workerData+"", con))
    let items = JSON.parse(await selectQuery("SELECT * FROM items where idworker ="+workerData+"",con))
    
    res.end(JSON.stringify({security:security[0],items:items}));
  }


  //Insert a user to items signs
  else if (clientRequest === '2') {
    let workerDatadecode = decodeURI(clientRequestInsert); //Decode for UTF-8
    let workerData = JSON.parse(workerDatadecode);


    let statement = "SELECT id from workers where id = '" + workerData.idworker + "'";
    let userExistResult = JSON.parse(await selectQuery(statement, con).catch((err) => { console.error(err) }));
    //Check if user exist if exists skip it, if not insert it
    if (userExistResult[0] === undefined) {
      let statement = "INSERT INTO workers (id,name,department) VALUES ('" + workerData.idworker + "','" + workerData.workername + "','" + workerData.department + "')";
      insertQuery(statement, con);
    }
    else
      console.log('user exist');

    statement = "INSERT INTO items (idworker,date,itworker,items,computer,phone,other,sign) VALUES ('" + workerData.idworker + "','" + workerData.date + "','" + workerData.itworker + "','" + workerData.arrItems + "','" + workerData.computer + "','" + workerData.phone + "','" + workerData.phone + "','" + workerData.dataURL + "')";
    insertQuery(statement, con)
  }

  //Insert a user to security signatures if not exist
  else if (clientRequest === '4') {
    let workerDatadecode = decodeURI(clientRequestInsert); //Decode for UTF-8
    let workerData = JSON.parse(workerDatadecode);

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
};


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

console.log('Server is listening');
const server = http.createServer(requestListener);
server.listen(8080);

