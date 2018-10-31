var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var app = express();
app.set('port', 9000);
app.use(bodyParser.urlencoded({ extended: true }));
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

app.use(function printSession(req, res, next) {
    console.log('1 req.session ', req.session);
    return next();
  });

var sessionChecker = (req, res, next) => {
    if (req.session.username ) {
       // res.redirect('/splitwise');
    } else {
        next();
    }    
};


app.get('/', sessionChecker, (req, res) => {
    //res.send('hello from app get');
    
    console.log('2 request session after assignment ' + req.session.user);
     res.sendFile(__dirname + '/publichtml/signup.html');
});

app.post('/', sessionChecker, (req, res) => {
    //res.send('hello from app get');
    req.session.user = req.body.name;
     console.log('3 request session object ' + req.session.user);
});

app.post('/signup', sessionChecker, (req, res) => {
    //res.send('hello from app get');
    req.session.user = req.body.username;
    console.log('5 req.session.user ' + req.session.user);
    console.log('5 req.body.name ' + req.body.username);
    console.log('5 request session object ' + req.session.user);
    //res.sendFile(__dirname + '/publichtml/splitwise.html');
    res.redirect('/splitwise');
});

app.get('/splitwise', sessionChecker, (req, res) => {
    //res.send('hello from app get');
    
    console.log('6 req.session.user ' + req.session.user);
    console.log('6 req.body.name ' + req.body.username);
    console.log('6 request session object ' + req.session);
    res.sendFile(__dirname + '/publichtml/splitwise.html');
});

app.post('/splitwise', sessionChecker, (req, res) => {
    //res.send('hello from app get');
    
    
    console.log('7 req.body.publicaddressname ' + req.body.publicaddressname);
    console.log('7 request session object ' + req.session.user);
    res.sendFile(__dirname + '/publichtml/splitwise.html');
});

app.get('/signout', sessionChecker, (req, res) => {
    //res.send('hello from app get');
    console.log('7 request session object before destroy ' + req.session);
    req.session.destroy(function(err) {
        if(err) {
            console.log('7 request session object after destroy err ' + req.session);
          return next(err);
        } else {
            console.log('7 request session object after destroy ' + req.session);
          return res.redirect('/');
        }
      });

    
});

app.listen(3000, () => {
    console.log(` 4 Started app at port 3000`);
  });