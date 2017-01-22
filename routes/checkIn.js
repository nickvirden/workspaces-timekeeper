var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Hello world!");
});

router.post('/', function(req, res, next) {
  req.body.content;
  res.send('Hello there Mr!');
});

module.exports = router;
