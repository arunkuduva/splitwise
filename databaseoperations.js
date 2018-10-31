
var insert = function(insertobject , callback){
    
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


module.exports.insert = insert;