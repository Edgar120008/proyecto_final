'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Professors', [
      {
        name: 'Dr. Juan Pérez',
        email: 'jperez@escom.com',
        department: 'Ciencias Computacionales',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dra. María García',
        email: 'mgarcia@escom.com',
        department: 'Matemáticas',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dr. Carlos López',
        email: 'clopez@escom.com',
        department: 'Ingeniería de Software',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Dra. Ana Martínez',
        email: 'amartinez@escom.com',
        department: 'Bases de Datos',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Professors', null, {});
  }
};