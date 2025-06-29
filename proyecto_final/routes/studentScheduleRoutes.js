const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const {
  getGroupSchedule,
  createAppointment,
  downloadSchedulePDF
} = require('../controllers/studentScheduleController');

router.use(auth, role('student'));

router.get('/schedule', getGroupSchedule);
router.post('/appointments', createAppointment);
router.get('/schedule/pdf', downloadSchedulePDF);

module.exports = router;