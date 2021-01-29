var express = require('express');
var router = express.Router();
const journeyModel = require('../models/journey');
const userModel = require('../models/users');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('login');
});


/* GET Login */
router.get('/login', function(req, res, next) {
  res.render('login', {  });
});

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
router.get('/database', function(req, res, next) {

  var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"];
  var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"];

  // Permet de savoir combien de trajets il y a par ville en base
  for(i=0; i<city.length; i++){

    journeyModel.find( 
      { departure: city[i] } , //filtre
      function (err, journey) {
          console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
      }
    )
  }
  res.render('index', { title: 'Express' });
});

router.get('/homepage', function(req, res, next) {
  req.session.dataJourney = [];
  res.render('homepage');
});

router.post('/result', async function(req, res, next){

  console.log(req.session.user.name);
  console.log(req.session.dataJourney);

  var date = new Date(req.body.date)
  dateFr = date.toLocaleDateString('fr-FR', {month: "numeric", day: "numeric"});

  var itineraire = await journeyModel.find(
      {departure: req.body.departure, arrival: req.body.arrival, date: date}
  )

  if(itineraire.length == 0){
   res.redirect('/error')
  }else{
    res.render('result', {itineraire: itineraire, dateFr: dateFr});
  }

});

router.get('/basket', function(req, res, next){

  if (req.session.dataJourney == undefined) {
    req.session.dataJourney = [];
  };

  var date = new Date(req.query.dateJourney)
  dateFr = date.toLocaleDateString();

  req.session.dataJourney.push({
      departure: req.query.cityDeparture,
      arrival: req.query.cityArrival,
      date: dateFr,
      departureTime: req.query.departureTime,
      price: req.query.price
  })

res.render('basket', {dataJourney: req.session.dataJourney})
});

router.get('/add-order', async function(req, res, next){
  console.log(req.session.dataJourney);
  
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

res.redirect('homepage')
});


router.get('/history', async function(req, res, next){

  var allTrips = await userModel.find(
    {name: req.session.user.name}
  )

  console.log(allTrips);


  res.render('history', {allTrips: allTrips})
});


module.exports = router;
