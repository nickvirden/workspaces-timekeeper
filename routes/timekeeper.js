var express = require('express');
var router = express.Router();

// POST
router.get('/', function(req, res) {

	console.log(req.params);

	res.send("Hi there!");

});

// POST
router.post('/timekeeper', function(req, res) {

	res.send({"this": "is a response"});

});

module.exports = router;