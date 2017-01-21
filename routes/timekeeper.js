var express = require('express');
var router = express.Router();

/* POST users listing. */
router.post('/timekeeper', function(req, res, next) {
  
	console.log(req);

	res.setHeader('Content-Type', 'application/json');
    res.json({ a: 1 });

});

module.exports = router;