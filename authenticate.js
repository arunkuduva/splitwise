
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var authenticate = (req, res, next) => {
  try {

    decoded = jwt.verify(req.session.token, 'sun2moon');
  } 
  catch(e){
    console.log('error in verifying u , signin again' + JSON.stringify(e));
    res.redirect('/signin');
  }
  console.log('inside authenticate ' + JSON.stringify(decoded));
  next();
};

module.exports = {authenticate};
