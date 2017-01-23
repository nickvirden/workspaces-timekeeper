var express = require('express');
var router = express.Router();

// GET
router.get('/', function(req, res) {
	res.send("Check Out GET route.");
});

// POST
router.post('/', function(req, res, next) {
	console.log("Check Out POST route.")

 	res.status(200).send();
	res.send("You could reach Harvest with that route!");

});

module.exports = router;