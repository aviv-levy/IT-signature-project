

var mysql = require('mysql');



const http = require('http');

let clientRequest;

const requestListener = function (req, res) {
  res.writeHead(200);
  clientRequest = req.headers['1'];//read key from all
  let clientRequestInsert = req.headers['2'];// read key with a value to insert a user

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "myworkers"
  });


  //Select all from users
  if (clientRequest === '1') {
    con.connect(function (err) {
      if (err) throw err;
      con.query("SELECT * FROM workers", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.end(JSON.stringify(result));
      });
    });
  }

  else if(clientRequest === '3'){
    con.connect(function (err) {
      if (err) throw err;
      con.query("SELECT * FROM items", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.end(JSON.stringify(result));
      });
    });
  }


  //Insert a user
  if (clientRequest === '2') {
    let workerDatadecode = decodeURI(clientRequestInsert); //Decode for UTF-8
    let workerData = JSON.parse(workerDatadecode);
 
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");

      var sql = "SELECT COUNT(id) from workers where id = '"+workerData.idworker+"'";
      con.query(sql, function (err, result) {
        if (err) throw err;
        //Check if user exist if exists skip it, if not insert it
        if(result[0]['COUNT(id)'] < 1 ){
          var sql = "INSERT INTO workers (id,name,department) VALUES ('" + workerData.idworker + "','" + workerData.workername + "','" + workerData.department + "')";
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
          });
    
        }
      });

      
      var sql = "INSERT INTO items (idworker,date,itworker,items,computer,phone,other,sign) VALUES ('" + workerData.idworker + "','" + workerData.date + "','" + workerData.itworker + "','" + workerData.arrItems + "','" + workerData.computer + "','" + workerData.phone + "','" + workerData.phone + "','" + workerData.dataURL + "')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });
  }
}

const server = http.createServer(requestListener);
server.listen(8080);

