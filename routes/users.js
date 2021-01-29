var express = require('express');
const userModel = require('../models/users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET Logout */
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  req.session.dataJourney = [];
  res.redirect('/');
});

/* POST Sign-up */
router.post('/sign-up', async (req, res) => {
  
  const searchUser = await userModel.findOne({ email: req.body.email });
  
  if(searchUser == null) {
    let newUser = new userModel ({
      email: req.body.email,
      name: req.body.name,
      firstName: req.body.firstName,
      password: req.body.password
    });
    req.session.user = await newUser.save();
    console.log("User connecté : " + req.session.user.firstName + ' ' + req.session.user.name);
    res.redirect('/homepage');
  } else {
    res.redirect('/login');
  }
});

/* POST Sign-in */
router.post('/sign-in', async(req, res) => {
  
  const searchUser = await userModel.findOne({ email: req.body.email, password: req.body.password });
  
  if(searchUser != null) {
    req.session.user = searchUser;
    console.log("User connecté : " + req.session.user.firstName + ' ' + req.session.user.name);
    res.redirect('/homepage');
  } else {
    res.redirect('/login');
  };
});

module.exports = router;
