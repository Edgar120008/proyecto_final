const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  assignGroupToStudent,
  removeGroupFromStudent,
  createGroup,
  getAllGroups,
  deleteGroup
} = require('../controllers/adminStudentController');

router.use(auth, role('admin'));

router.get('/students', getAllStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Rutas para grupos
router.get('/groups', getAllGroups);
router.post('/groups', createGroup);
router.delete('/groups/:id', deleteGroup);

// Rutas para asignación de grupos
router.post('/students/:studentId/groups/:groupId', assignGroupToStudent);
router.delete('/students/:studentId/groups/:groupId', removeGroupFromStudent);

module.exports = router;