const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const JSON = require('circular-json');
const database = require('./databaseconnect');
const databaseoperations = require('./databaseoperations');
const sendtransaction = require('./sendtransaction');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyuser = require('./verifyuser');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
// const hbs = require('hbs');

// app.set('view engine', 'hbs');


var app = express();

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

var authenticate = (req, res, next) => {
  decoded = jwt.verify(req.session.token, 'sun2moon');
  console.log('inside authenticate ' + JSON.stringify(decoded));
  next();
};

app.get('/signup',(req,resp,next)=> {

  resp.sendFile(__dirname + '/publichtml/signup.html');

});

app.post('/signup',(req,resp,next)=> {

  var hashedpassword;
  // console.log(JSON.stringify(req.method));
  // console.log(JSON.stringify(req.body));
  // console.log(JSON.stringify(req.query));
  // console.log(JSON.stringify(req.params));
  //resp.sendfile('index.html');
  //console.log( 'verify user is ' + verifyuser.verifyuserexists(database.con, req.body.emailaddress));
  
  
  req.session.user = req.body.username;
  console.log('session user in post signup ' + req.session.user);

   if ( verifyuser.verifyuserexists(database.con, req.body.emailaddress, (err, result) => {

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

    
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err){
        console.log('error in generating hash');
      } else {
        hashedpassword = hash;
        console.log('hashed password ' + hashedpassword);
        databaseoperations.insert({
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
              encodedtoken = encodeURIComponent(token);
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

  verifyuser.verifyuserexists(database.con, req.body.emailaddress, (err, result) => {

    if (err){
      console.log('error in database operation from midleware');
      } 
      else 
      {      
      console.log(' does the user exist  ' + JSON.stringify(result ));

      verifyuser.hashedpassword(database.con, req.body.emailaddress, (err, result) => {

        if ( result && bcrypt.compareSync(req.body.password , result)) {
           // update session
           console.log('req session object before updating' + JSON.stringify(req.session));
           access = 'auth' ;
           salt = 'sun2moon';
           var token = jwt.sign({emailaddress: req.body.emailaddress, access } , salt).toString();
           req.session.token = token;
           console.log('token from req session object' + JSON.stringify(req.session));
           //resp.sendfile(__dirname + '/publichtml/splitwise.html');
           resp.redirect('/splitwise');
        }
        else {
          console.log('password entered incorrectly');
        }
      });
    }
   });  
});

app.get('/splitwise', authenticate, (req,resp,next)=> {

  console.log('session user in get splitwise ' + JSON.stringify(req.session));
  resp.sendFile(__dirname + '/publichtml/splitwise.html');

});

app.post('/splitwise', authenticate , (req,resp,next)=> {

  resp.sendFile(__dirname + '/publichtml/splitwise.html');
  

  var sql = `INSERT INTO transaction_log VALUES ('${req.body.publicaddressname}', '0x2d565E2b684697C58AA38FA63E7c2E408F590289',${req.body.amountname})`;
  database.con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });

  sendtransaction.sendRaw(req.body.publicaddressname,req.body.amountname);

});

app.listen(3000, () => {
  console.log(`Started app at port 3000`);
});




// app.post('/todos', authenticate, (req, res) => {
//   var todo = new Todo({
//     text: req.body.text,
//     _creator: req.user._id
//   });

//   todo.save().then((doc) => {
//     res.send(doc);
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

// app.get('/todos', authenticate, (req, res) => {
//   Todo.find({
//     _creator: req.user._id
//   }).then((todos) => {
//     res.send({todos});
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

// app.get('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;

//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   Todo.findOne({
//     _id: id,
//     _creator: req.user._id
//   }).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

// app.delete('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;

//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   Todo.findOneAndRemove({
//     _id: id,
//     _creator: req.user._id
//   }).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

// app.patch('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;
//   var body = _.pick(req.body, ['text', 'completed']);

//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   if (_.isBoolean(body.completed) && body.completed) {
//     body.completedAt = new Date().getTime();
//   } else {
//     body.completed = false;
//     body.completedAt = null;
//   }

//   Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   })
// });

// // POST /users
// app.post('/users', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var user = new User(body);

//   user.save().then(() => {
//     return user.generateAuthToken();
//   }).then((token) => {
//     res.header('x-auth', token).send(user);
//   }).catch((e) => {
//     res.status(400).send(e);
//   })
// });

// app.get('/users/me', authenticate, (req, res) => {
//   res.send(req.user);
// });

// app.post('/users/login', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);

//   User.findByCredentials(body.email, body.password).then((user) => {
//     return user.generateAuthToken().then((token) => {
//       res.header('x-auth', token).send(user);
//     });
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

// app.delete('/users/me/token', authenticate, (req, res) => {
//   req.user.removeToken(req.token).then(() => {
//     res.status(200).send();
//   }, () => {
//     res.status(400).send();
//   });
// });

// app.listen(port, () => {
//   console.log(`Started up at port ${port}`);
// });

// module.exports = {app};
