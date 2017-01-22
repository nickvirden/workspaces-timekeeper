var express = require('express');
var router = express.Router();

// GET
router.get('/', function(req, res) {
	console.log(req.params);
	res.send("Hi there!");
});

// POST
router.post('/', function(req, res, next) {
  req.body.content;
  res.send('Hey there Mrs!');
});

module.exports = router;