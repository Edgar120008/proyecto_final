const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getAllProfessors,
  getProfessorSchedules,
  getProfessorOfficeHours
} = require('../controllers/studentController');

router.get('/professors', auth, getAllProfessors);
router.get('/professors/:id/schedules', auth, getProfessorSchedules);
router.get('/professors/:id/office-hours', auth, getProfessorOfficeHours);

module.exports = router;