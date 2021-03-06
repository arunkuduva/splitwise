
var inserttransactionlog = function(inserttxobject , callback){
    
    var sql = `insert into ${inserttxobject.tablename} 
    values( "${inserttxobject.values.name}" , "${inserttxobject.values.contractaddress}", ${inserttxobject.values.amount}, now())`;

    inserttxobject.con.query(sql ,function (err, result){

        if (err) {
            console.log('error in database insert of users '+err+ sql);
            callback(err);
        }
        else{

            console.log('successful insert into transactionlog' + JSON.stringify(result));
            callback(err,result);
        }
    });
    
}




var insertuser = function(insertobject , callback){
    
    var sql = `insert into ${insertobject.tablename} (name, email, password) 
    values( "${insertobject.values.name}" , "${insertobject.values.email}", "${insertobject.values.hashpass}")`;

    insertobject.con.query(sql ,function (err, result){

        if (err) {
            console.log('error in database insert of users '+err);
            callback(err);
        }
        else{

            console.log('successful insert into users' + JSON.stringify(result));
            callback(err,result);
        }
    });
    
}

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
            if (result.length >0)
            { 
                callback(undefined,result[0].password);
            }
        }
    });
};

var usertransactionlog = function(con,emailaddress,callback){
   // emailaddress = 'arun@yahoo.com';
    sql = `select * from transaction_log where email_address = '${emailaddress}'`;
    con.query(sql, (err , result) =>{
        if (err){
            console.log('error in database operation ');
            callback("error in database operation " + err);
        }
        else{
        //    console.log('transaction log of user ' + JSON.stringify(result));
            callback(undefined,result);
        }
    });
}

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


// usertransactionlog(con, 'arun@yahoo.com',(err,result)=>{
//     console.log(result);
// });
module.exports ={verifyuserexists,hashedpassword,insertuser,inserttransactionlog,usertransactionlog}; 