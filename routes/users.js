var express = require('express');
const userModel = require('../models/users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

/* POST Sign-up */
router.post('/sign-up', async (req, res) => {
  
  const searchUser = await userModel.findOne({ email: req.body.email });
  
  if(searchUser == null) {
    let newUser = new userModel ({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });
    req.session.user = await newUser.save();
    console.log(req.session.user.email);
    res.redirect('/homepage');
  } else {
    res.render('login');
  }
});

/* POST Sign-in */
router.post('/sign-in', async(req, res) => {
  
  const searchUser = await userModel.findOne({ email: req.body.email, password: req.body.password });
  
  if(searchUser != null) {
    req.session.user = searchUser;
    console.log(req.session.user.username);
    res.redirect('/weather');
  } else {
    res.render('login', {})
  };

  res.redirect('homepage')
});