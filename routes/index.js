var express = require('express');
var router = express.Router();
const Temperature = require('../models/temperature');

/* GET home page. */
router.get('/', function (req, res, next) {
  const title = '体温記録くん';
  if (req.user) {
    Temperature.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['"createdAt"', 'DESC']]
    }).then((temperatures) => {
      res.render('index', {
        title: title,
        user: req.user,
        temperatures
      });
    });
  } else {
    res.render('index', { title: title });
  }
});

module.exports = router;
