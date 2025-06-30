const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const {
  getGroupSchedule,
  createAppointment,
  getStudentAppointments,
  updateAppointment,
  deleteAppointment,
  downloadSchedulePDF
} = require('../controllers/studentScheduleController');

router.use(auth, role('student'));

router.get('/schedule', getGroupSchedule);
router.post('/appointments', createAppointment);
router.get('/schedule/pdf', downloadSchedulePDF);

router.get('/appointments', getStudentAppointments);
router.post('/appointments', createAppointment);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

module.exports = router;