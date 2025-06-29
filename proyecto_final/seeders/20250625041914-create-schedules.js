'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Schedules', [
      // Horarios para el profesor 1 (Juan Pérez) - Grupo A
      {
        day: 'Lunes',
        startTime: '07:00:00',
        endTime: '09:00:00',
        classroom: 'A-101',
        subject: 'Programación Orientada a Objetos',
        professorId: 1,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Miércoles',
        startTime: '07:00:00',
        endTime: '09:00:00',
        classroom: 'A-101',
        subject: 'Programación Orientada a Objetos',
        professorId: 1,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Viernes',
        startTime: '09:00:00',
        endTime: '11:00:00',
        classroom: 'B-205',
        subject: 'Estructuras de Datos',
        professorId: 1,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Horarios para el profesor 2 (María García) - Grupo B
      {
        day: 'Martes',
        startTime: '11:00:00',
        endTime: '13:00:00',
        classroom: 'C-302',
        subject: 'Matemáticas Discretas',
        professorId: 2,
        groupId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Jueves',
        startTime: '11:00:00',
        endTime: '13:00:00',
        classroom: 'C-302',
        subject: 'Matemáticas Discretas',
        professorId: 2,
        groupId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Horarios para el profesor 3 (Carlos López) - Grupo A
      {
        day: 'Lunes',
        startTime: '13:00:00',
        endTime: '15:00:00',
        classroom: 'D-104',
        subject: 'Ingeniería de Software',
        professorId: 3,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Miércoles',
        startTime: '13:00:00',
        endTime: '15:00:00',
        classroom: 'D-104',
        subject: 'Ingeniería de Software',
        professorId: 3,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Horarios para el profesor 4 (Ana Martínez) - Grupo C
      {
        day: 'Martes',
        startTime: '15:00:00',
        endTime: '17:00:00',
        classroom: 'E-201',
        subject: 'Bases de Datos',
        professorId: 4,
        groupId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        day: 'Jueves',
        startTime: '15:00:00',
        endTime: '17:00:00',
        classroom: 'E-201',
        subject: 'Bases de Datos',
        professorId: 4,
        groupId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Schedules', null, {});
  }
};