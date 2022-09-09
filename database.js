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
  if (clientRequest === '1'){
       res.end(await selectQuery("SELECT * FROM workers",con));
  }
  
  else if (clientRequest === '3') 
      await selectQuery("SELECT * FROM items",res,con);


  //Insert a user
  if (clientRequest === '2') {
    let workerDatadecode = decodeURI(clientRequestInsert); //Decode for UTF-8
    let workerData = JSON.parse(workerDatadecode);


      let statement = "SELECT COUNT(id) from workers where id = '" + workerData.idworker + "'";
      let userExistResult = JSON.parse(await selectQuery(statement,con));
        //Check if user exist if exists skip it, if not insert it
        if (userExistResult[0]['COUNT(id)'] < 1) {
          var sql = "INSERT INTO workers (id,name,department) VALUES ('" + workerData.idworker + "','" + workerData.workername + "','" + workerData.department + "')";
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
          });
        }
        else
          console.log('user exist');



      var sql = "INSERT INTO items (idworker,date,itworker,items,computer,phone,other,sign) VALUES ('" + workerData.idworker + "','" + workerData.date + "','" + workerData.itworker + "','" + workerData.arrItems + "','" + workerData.computer + "','" + workerData.phone + "','" + workerData.phone + "','" + workerData.dataURL + "')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    };
  }


function selectQuery(statement,con) {
  let myresult = new Promise ((resolve)=>con.connect(function (err) {
    if (err) throw err;
    con.query(statement, function (err, result, fields) {
      if (err) throw err;
      //console.log(result);
      resolve(JSON.stringify(result)) ;
    });
  }));
  return myresult ;
}

function insertQuery(statement) {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    con.query(statement, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
}

const server = http.createServer(requestListener);
server.listen(8080);

