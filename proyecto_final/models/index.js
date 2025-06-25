const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(dbConfig.development);

const models = {
  User: require('./User')(sequelize),
  Professor: require('./Professor')(sequelize),
  Schedule: require('./Schedule')(sequelize),
  OfficeHour: require('./OfficeHour')(sequelize),
  sequelize: sequelize,
  Sequelize: Sequelize
};

// Cambia todas las relaciones para usar ON DELETE CASCADE y ser consistentes
models.Professor.hasMany(models.Schedule, { 
  foreignKey: {
    name: 'professorId',
    allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
models.Schedule.belongsTo(models.Professor, { 
  foreignKey: {
    name: 'professorId',
    allowNull: false
  }
});

models.Professor.hasMany(models.OfficeHour, { 
  foreignKey: {
    name: 'professorId',
    allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
models.OfficeHour.belongsTo(models.Professor, { 
  foreignKey: {
    name: 'professorId',
    allowNull: false
  }
});

module.exports = models;