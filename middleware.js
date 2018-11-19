
const database = require('./databaseconnect');
const databaseoperations = require('./databaseoperations');
const sendtransaction = require('./sendtransaction');
const authenticate = require('./authenticate').authenticate;
const verifyuser = require('./verifyuser');
const populateviewobject = require('./populateviewobject');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const JSON = require('circular-json');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');

 
var app = express();
//hbs.registerPartials(__dirname + '/views/partials')
app.engine('handlebars', exphbs({
  defaultLayout: 'home',
  partialsDir  : [
    __dirname + '/views/layouts',
]
}));
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'publichtml')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
      expires: 60000
  }
}));

app.get('/status',(req,resp,next)=> {

  resp.send(populateviewobject.viewobject);

});


app.get('/signup',(req,resp,next)=> {

  resp.sendFile(__dirname + '/publichtml/signup.html');

});

app.post('/signup',(req,resp,next)=> {

  var hashedpassword;
  req.session.user = req.body.username;
  console.log('session user in post signup ' + req.session.user);

   if ( databaseoperations.verifyuserexists(database.con, req.body.emailaddress, (err, result) => {

    if (err){
      console.log('error in database operation from midleware');
    } else {
      
      console.log(' does the user exist  ' + JSON.stringify(result ));
    }

   }) ){
   
    console.log('user already exists sign in ');
    resp.sendFile(__dirname + '/publichtml/signin.html');
   } 
   else {

  //salt = 'sun2moon';
    
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.pwd2, salt, (err, hash) => {
      if (err){
        console.log('error in generating hash'+JSON.stringify(err));
      } else {
        hashedpassword = hash;
        console.log('hashed password ' + hashedpassword);
        databaseoperations.insertuser({
          con: database.con,
          tablename: 'Users',
          values : {
            name : req.body.username,
            email: req.body.emailaddress,
            hashpass: hashedpassword
          }
        } , (err,result) =>{
            if (err){
              console.log('error in database insert of users '+err);
            }
            else{
      
              console.log('successful insert into users' + JSON.stringify(result));
              access = 'auth' ;
              var token = jwt.sign({emailaddress: req.body.emailaddress, access } , 'sun2moon').toString();
      
             // resp.header('x-auth', token)
            //encodedtoken = encodeURIComponent(token);
              
              access = 'auth' ;
              salt = 'sun2moon';
              var token = jwt.sign({emailaddress: req.body.emailaddress, access } , salt).toString();
              req.session.token = token;
              req.session.user = req.body.emailaddress;
              resp.sendfile(__dirname + '/publichtml/splitwise.html');
             
          }
      
        });
      }
    });
  });
   }


});

app.get('/signin',(req,resp,next)=> {

  resp.sendFile(__dirname + '/publichtml/signin.html');

});


app.post('/signin', (req,resp,next)=> {

  console.log(JSON.stringify(req.body));
 
  databaseoperations.verifyuserexists(database.con, req.body.emailaddress, (err, result) => {

    if (err){
      console.log('error in database operation from midleware');
      } 
      else 
      {    
        if(result)  {
      console.log(' does the user exist  ' + JSON.stringify(result ));

      databaseoperations.hashedpassword(database.con, req.body.emailaddress, (err, result) => {

        if ( result && bcrypt.compareSync(req.body.password , result)) {
           // update session
           console.log('req session object before updating' + JSON.stringify(req.session));
           access = 'auth' ;
           salt = 'sun2moon';
           var token = jwt.sign({emailaddress: req.body.emailaddress, access } , salt).toString();
           req.session.token = token;
           req.session.user = req.body.emailaddress;
           console.log('token from req session object' + JSON.stringify(req.session));
           //resp.sendfile(__dirname + '/publichtml/splitwise.html');
           resp.redirect('/splitwise');
        }
        else {
          console.log('password entered incorrectly');
        }
      });
    }
      else {
        console.log('user does not exist ');
        resp.redirect('/signup');
      }
    }
   })
  ;  
});

app.get('/splitwise', authenticate, (req,resp,next)=> {

  console.log('session user in get splitwise ' + JSON.stringify(req.session));
  resp.sendFile(__dirname + '/publichtml/splitwise.html');

});

app.post('/splitwise', authenticate , (req,resp,next)=> {

  
  
  if(req.body.fundsplitwisename === 'signout'){
    resp.redirect('/signin');
   
    req.session.destroy(function(err) {
      if(err) {
          console.log('7 request session object after destroy err ' + req.session);
        return next(err);
      } else {
          console.log('7 request session object after destroy ' + req.session);
       // return resp.redirect('/signin');
      }
    });
  } else{

  

  var  inserttxobject = {
      con: database.con,
      tablename : 'transaction_log',
      values : {
          name: req.session.user,
          contractaddress: req.body.publicaddressname,
          amount:req.body.amountname
      }
    };
    console.log('stringify insert obhect ' + JSON.stringify(inserttxobject));
  

  sendtransaction.sendRaw(req.body.publicaddressname,req.body.amountname , (err, result)=>{

    if (err) {
      console.log("send transaction failed in block chain "+ JSON.stringify(err));
    } else{
      console.log("send transaction succeded in blockchain "+ JSON.stringify(result));
      databaseoperations.inserttransactionlog(inserttxobject, (err, result)=>
      {
        if (err) {
          console.log("error in insert transaction "+ JSON.stringify(err));
        } else{
          console.log("1 insert transaction "+ JSON.stringify(result));
        }
        
      });
    }
  });
  //resp.sendFile(__dirname + '/publichtml/splitwise.html');
  databaseoperations.usertransactionlog(database.con,req.session.user,(err,result)=>{

     if (err){
         console.log('error in fetcjing transaction log');
         
     }
     else{
       console.log('transaction log of user ' + JSON.stringify({"label":result}));

       resp.render('home', {

        contract_balance: populateviewobject.viewobject.contract_balance,
        did_i_withdraw : populateviewobject.viewobject.did_i_withdraw,
        am_i_funded: populateviewobject.viewobject.am_i_funded,
        total_amount_collected: populateviewobject.viewobject.total_amount_collected,
        number_of_parti : populateviewobject.viewobject.number_of_parti,
        trxlog : {"trxlog":result}.trxlog
      });
       
     }

  });
  
  }
});

app.listen(3000, () => {
  console.log(`Started app at port 3000`);
});

