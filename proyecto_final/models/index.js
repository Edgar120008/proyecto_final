const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(dbConfig.development);

const models = {
  User: require('./User')(sequelize),
  Professor: require('./Professor')(sequelize),
  Schedule: require('./Schedule')(sequelize),
  OfficeHour: require('./OfficeHour')(sequelize),
  Group: require('./Group')(sequelize),
  UserGroup: require('./UserGroup')(sequelize),
  Appointment: require('./Appointment')(sequelize),
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

models.User.belongsToMany(models.Group, { through: models.UserGroup });
models.Group.belongsToMany(models.User, { through: models.UserGroup });

models.User.hasMany(models.Appointment, { foreignKey: 'studentId' });
models.Appointment.belongsTo(models.User, { foreignKey: 'studentId' });

models.Professor.hasMany(models.Appointment, { foreignKey: 'professorId' });
models.Appointment.belongsTo(models.Professor, { foreignKey: 'professorId' });

models.Group.hasMany(models.Schedule, {
  foreignKey: 'groupId'
});
models.Schedule.belongsTo(models.Group, {
  foreignKey: 'groupId'
});

// Relación entre Professor y Schedule
models.Professor.hasMany(models.Schedule, {
  foreignKey: 'professorId'
});
models.Schedule.belongsTo(models.Professor, {
  foreignKey: 'professorId'
});

// Agregar esta relación después de las existentes
models.Group.hasMany(models.Schedule, { foreignKey: 'groupId' });
models.Schedule.belongsTo(models.Group, { foreignKey: 'groupId' });

module.exports = models;