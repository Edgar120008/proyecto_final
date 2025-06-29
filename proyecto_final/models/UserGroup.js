const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserGroup = sequelize.define('UserGroup', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });

  return UserGroup;
};