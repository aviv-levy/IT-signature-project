

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


  //Insert a user
  if (clientRequest === '2') {
    let workerData = JSON.parse(clientRequestInsert);
    console.log(workerData);
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
      var sql = "INSERT INTO workers (id,name,date,department,itworker,items,computer,phone,other,sign) VALUES ('" + workerData.idworker + "', '" + workerData.workername + "','" + workerData.date + "','" + workerData.department + "','" + workerData.itworker + "','" + workerData.items + "','"+workerData.computer+"','"+workerData.phone+"','"+workerData.phone+"','"+workerData.dataURL+"')";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });
  }
}

const server = http.createServer(requestListener);
server.listen(8080);

