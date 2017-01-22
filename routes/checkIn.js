var express = require('express');
var router = express.Router();

// GET
router.get('/', function(req, res, next) {
  res.send("Hello world!");
});

// POST
router.post('/', function(req, res, next) {
  if (!req.body) {
    res.json({"There's": "nothing here!"});
  }
  // req.body.content;
  res.send('Hello there Mr!');
});

var harvestId = 'ID';

// POST TO HARVEST
router.post('/https://nickvirden.harvestapp.com/daily/add', function(req, res, next) {
  res.send('ID');
  console.log('A new card has been created and sent to Harvest')
})

module.exports = router;
