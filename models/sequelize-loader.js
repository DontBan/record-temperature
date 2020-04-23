'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/record_temperature',
  {
    operatorAliases: false
  }
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};