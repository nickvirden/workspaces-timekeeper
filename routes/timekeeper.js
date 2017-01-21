var express = require('express');
var router = express.Router();

/* POST users listing. */
router.post('/timekeeper', function(req, res, next) {
  
	console.log(req);

	res.send('Hello world!');
});

module.exports = router;