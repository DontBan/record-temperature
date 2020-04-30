'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const uuid = require('uuid');
const Temperature = require('../models/temperature');
const User = require('../models/user');

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  const temperatureId = uuid.v4();
  const updatedAt = new Date();
  Temperature.create({
    temperatureId: temperatureId,
    temperatureValue: req.body.temperatureValue || '0.0',
    createdBy: req.user.id,
    updatedAt: updatedAt,
    createdAt: updatedAt
  }).then((temperature) => {
    res.redirect('/temperatures/' + temperature.temperatureId);
  });
});

router.get('/:temperatureId', authenticationEnsurer, (req, res, next) => {
  Temperature.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }
    ],
    where: {
      temperatureId: req.params.temperatureId
    },
    order: [['"createdAt"', 'DESC']]
  }).then((temperature) => {
    if (temperature) {
      res.render('temperature', {
        user: req.user,
        temperature: temperature,
      });
    } else {
      const err = new Error('指定された体温記録は見つかりません');
      err.status = 404;
      next(err);
    }
  });
});

module.exports = router;