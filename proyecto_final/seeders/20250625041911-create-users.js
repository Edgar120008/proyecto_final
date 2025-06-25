'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('password123', 10);
    
    return queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password: password,
        email: 'admin@escom.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'student1',
        password: password,
        email: 'student1@escom.com',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'student2',
        password: password,
        email: 'student2@escom.com',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};