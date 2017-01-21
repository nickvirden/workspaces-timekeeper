var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  var checkIn = new messageId(req.body);
  checkIn.save(function(err) {
    if (err) {
      res.status(500).send();
    }
    else {
      res.json(message);
    }
  })
});

router.post('/', function(req, res, next) {
  var checkOut = new messageId(req.body);
  checkOut.save(function(err) {
    if (err) {
      res.status(500).send();
    }
    else {
      res.json(message);
    }
  })
});

module.exports = router;