var express = require('express');
var router = express.Router();

// GET
router.get('/', function(req, res) {
	res.send("Hi there!");
});

// POST
router.post('/', function(req, res, next) {
  req.body.content;
  res.send('Hey there Mrs!');
});

var harvestId = 'Ended-At';

// POST TO HARVEST
router.post('/https://nickvirden.harvestapp.com/daily/add', function(req, res, next) {
  res.send(harvestId);
  console.log('Your time has been saved and updated in Harvest')
})

module.exports = router;
