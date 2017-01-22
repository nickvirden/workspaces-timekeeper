var express = require('express');
var router = express.Router();

// GET
router.get('/', function(req, res) {
	res.send("Hi there!");
});

// POST
router.post('/checkOut', function(req, res, next) {
  req.body.content;
  res.send('Hey there Mrs!');
});

module.exports = router;
