'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Temperature = loader.database.define('temperatures', {
  temperatureId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  temperatureValue: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false,
  indexes: [
    {
      fields: ['createdBy']
    }
  ]
});

module.exports = Temperature;