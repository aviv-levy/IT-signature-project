require('dotenv').config();
var mysql = require('mysql');

class Database {
  constructor() {

  }
  //SQL config
  con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  });

  selectQuery(statement) {
    let myresult = new Promise((resolve) => {
      this.con.query(statement, function (err, result, fields) {
        if (err) reject(err);
        // console.log(result);
        resolve(JSON.stringify(result));
      });
    });
    return myresult;
  }

  async insertUpdateQuery(statement) {
    return await new Promise((resolve, reject) => this.con.query(statement, (err, results) => {
      if (err) {
        reject(err)
      } else {
        resolve(results);
      }
    }));
  };

  async deleteQuery(statement, comment, statement2 = 0) {
    await this.con.query(statement, function (err, result) {
      if (err) throw err;
      console.log(comment);
    });
    if (statement2 !== 0)
      await this.con.query(statement2, function (err, result) {
        if (err) throw err;
        console.log(comment);
      });
  };
}

module.exports = Database;