// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "sun2moon",
//   database: "blockchain",
//   //insecureAuth : false
// });

// con.connect(function(err) {
//   if (err) {
//     console.log("not Connected!" + err );    
//   }else {
//     console.log("DB Connected!");
//   }
// });

var verifyuserexists = function(con , emailaddress , callback) {

    sql = `select true from users where email = '${emailaddress}'`;
    con.query(sql , (err, result) => {
        if (err){
            console.log('user does not exist' + JSON.stringify(err) );
            callback("error in database operation");
        } else{
           console.log('result is ' + JSON.stringify(result));
            if (result) { 
                console.log('returning true' );
                callback(undefined, true);
            }
            else {
                console.log('returning false' );
                callback(undefined,false);
            }
        }

    }
)};

var hashedpassword = function(con, emailaddress, callback){

    sql = `select password from users where email = '${emailaddress}'`
    con.query(sql, (err, result) => {
        if (err){
            console.log('error in database operation ');
            callback("error in database operation " + err);
        }
        else{
            console.log('fetched hashed password ' + JSON.stringify(result));
            if (!(typeof result[0].password == undefined)) { callback(undefined,result[0].password);}
        }
    });
};

// hashedpassword(con,'arunkuduva@gmail.com' , (err, result)=>{
//     console.log('result is ' + result[0].password);
// });

module.exports = {verifyuserexists,hashedpassword};