const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const {
  createProfessor,
  getAllProfessors,
  updateProfessor,
  deleteProfessor,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  createOfficeHour,
  updateOfficeHour,
  deleteOfficeHour
} = require('../controllers/adminController');

router.use(auth, role('admin'));

// Rutas para profesores
router.post('/professors', createProfessor);
router.get('/professors', getAllProfessors);
router.put('/professors/:id', updateProfessor);
router.delete('/professors/:id', deleteProfessor);

// Rutas para horarios de clase
router.post('/professors/:professorId/schedules', createSchedule);
router.put('/professors/:professorId/schedules/:scheduleId', updateSchedule);
router.delete('/professors/:professorId/schedules/:scheduleId', deleteSchedule);

// Rutas para horarios de atención
router.post('/professors/:professorId/office-hours', createOfficeHour);
router.put('/professors/:professorId/office-hours/:officeHourId', updateOfficeHour);
router.delete('/professors/:professorId/office-hours/:officeHourId', deleteOfficeHour);

module.exports = router;