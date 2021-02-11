var express = require('express');
var router = express.Router();
const journeyModel = require('../models/journey');
const userModel = require('../models/users');


router.get('/', function(req, res, next) {
  res.redirect('login');
});


/* GET Login */
router.get('/login', function(req, res, next) {
  res.render('login', {  });
});


router.get('/homepage', function(req, res, next) {
  if (req.session.user == undefined) {
    res.redirect('/login')
  };
  req.session.dataJourney = [];
  res.render('homepage', {user: req.session.user});
});

router.post('/result', async function(req, res, next){

  if (req.session.user == undefined) {
    res.redirect('/login')
  };

  var date = new Date(req.body.date)
  dateFr = date.toLocaleDateString('fr-FR', {month: "numeric", day: "numeric"});

  var itineraire = await journeyModel.find(
      {departure: req.body.departure, arrival: req.body.arrival, date: date}
  )

  if(itineraire.length == 0){
   res.redirect('/error')
  }else{
    res.render('result', {user: req.session.user, itineraire: itineraire, dateFr: dateFr});
  }

});

router.get('/basket', function(req, res, next){

  if (req.session.user == undefined) {
    res.redirect('/login')
  };

  if (req.session.dataJourney == undefined) {
    req.session.dataJourney = [];
  };

  var date = new Date(req.query.dateJourney)
  dateFr = date.toLocaleDateString('fr-FR', {year: "numeric", month: "numeric", day: "numeric"});

  req.session.dataJourney.push({
      departure: req.query.cityDeparture,
      arrival: req.query.cityArrival,
      date: dateFr,
      departureTime: req.query.departureTime,
      price: req.query.price
  })

res.render('basket', {user: req.session.user, dataJourney: req.session.dataJourney})
});

router.get('/add-order', async function(req, res, next){
  if (req.session.user == undefined) {
    res.redirect('/login')
  };

  var lastOrders = await userModel.find(
    {name: req.session.user.name}
  )

  for (let i = 0; i < req.session.dataJourney.length; i++) {
    lastOrders[0].orders.push(req.session.dataJourney[i])
  }

  var savedUser = await userModel.updateOne(
    {name: req.session.user.name},
    {orders: lastOrders[0].orders}
  )

res.redirect('/homepage')
});


router.get('/history', async function(req, res, next){

  if (req.session.user == undefined) {
    res.redirect('/login')
  };

  var allTrips = await userModel.find(
    {name: req.session.user.name}
  )

  res.render('history', {user: req.session.user, allTrips: allTrips})
});


module.exports = router;
