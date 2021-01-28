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


module.exports = router;
