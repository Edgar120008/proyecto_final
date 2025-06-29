const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const {
  getAllStudents,
  createStudent,
  assignGroupToStudent,
  createGroup
} = require('../controllers/adminStudentController');

router.use(auth, role('admin'));

router.get('/students', getAllStudents);
router.post('/students', createStudent);
router.post('/groups', createGroup);
router.post('/students/:studentId/groups/:groupId', assignGroupToStudent);

module.exports = router;