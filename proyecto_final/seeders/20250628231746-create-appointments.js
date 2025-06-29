'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Appointments', [
      {
        date: new Date('2023-12-15'),
        startTime: '14:00:00',
        endTime: '15:00:00',
        reason: 'Dudas sobre el proyecto final',
        status: 'confirmed',
        professorId: 1,
        studentId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date: new Date('2023-12-16'),
        startTime: '10:00:00',
        endTime: '11:00:00',
        reason: 'Consulta sobre el examen',
        status: 'pending',
        professorId: 2,
        studentId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Appointments', null, {});
  }
};