var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  var checkIn = new Message(req.body);
  checkIn.save(function(err) {
    if (err) {
      res.status(500).send();
    }
    else {
      res.json(message);
    }
  })
})

module.exports = router;