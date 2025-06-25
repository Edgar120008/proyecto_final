'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('OfficeHours', [
      // Horarios de atención para el profesor 1 (Juan Pérez)
      {
        day: 'Lunes',
        startTime: '16:00:00',
        endTime: '18:00:00',
        location: 'Oficina 101, Edificio A',
        professorId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Miércoles',
        startTime: '16:00:00',
        endTime: '18:00:00',
        location: 'Oficina 101, Edificio A',
        professorId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Horarios de atención para el profesor 2 (María García)
      {
        day: 'Martes',
        startTime: '09:00:00',
        endTime: '11:00:00',
        location: 'Oficina 205, Edificio B',
        professorId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Horarios de atención para el profesor 3 (Carlos López)
      {
        day: 'Jueves',
        startTime: '10:00:00',
        endTime: '12:00:00',
        location: 'Oficina 302, Edificio C',
        professorId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Horarios de atención para el profesor 4 (Ana Martínez)
      {
        day: 'Viernes',
        startTime: '13:00:00',
        endTime: '15:00:00',
        location: 'Oficina 104, Edificio D',
        professorId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OfficeHours', null, {});
  }
};