const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Professor = sequelize.define('Professor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Professor;
};