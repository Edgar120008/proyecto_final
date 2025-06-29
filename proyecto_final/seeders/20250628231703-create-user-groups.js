'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserGroups', [
      {
        userId: 2, // student1
        groupId: 1, // Grupo A
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3, // student2
        groupId: 1, // Grupo A
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserGroups', null, {});
  }
};