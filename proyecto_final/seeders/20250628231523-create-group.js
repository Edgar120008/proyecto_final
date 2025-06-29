'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Groups', [
      {
        name: 'Grupo A',
        maxCapacity: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Grupo B',
        maxCapacity: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Grupo C',
        maxCapacity: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Groups', null, {});
  }
};