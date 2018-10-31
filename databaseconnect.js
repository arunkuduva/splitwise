var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sun2moon",
  database: "blockchain",
  //insecureAuth : false
});

con.connect(function(err) {
  if (err) {
    console.log("not Connected!" + err );    
  }else {
    console.log("DB Connected!");
  }
});

module.exports.con  = con;