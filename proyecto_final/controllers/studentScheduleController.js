const { Group, Schedule, Appointment, Professor, User } = require('../models');
const PDFDocument = require('pdfkit');
const { Op } = require('sequelize');

const getGroupSchedule = async (req, res) => {
  try {
    // Primero obtener los grupos del estudiante
    const student = await User.findByPk(req.user.id, {
      include: [{
        model: Group,
        through: { attributes: [] },
        attributes: ['id', 'name']
      }]
    });

    if (!student || !student.Groups || student.Groups.length === 0) {
      return res.status(404).send({ error: 'No estás asignado a ningún grupo' });
    }

    // Obtener los IDs de los grupos del estudiante
    const groupIds = student.Groups.map(group => group.id);

    // Obtener los horarios directamente usando los groupIds
    const schedules = await Schedule.findAll({
      where: { groupId: groupIds },
      include: [{
        model: Professor,
        attributes: ['name']
      }],
      order: [
        ['day', 'ASC'],
        ['startTime', 'ASC']
      ]
    });

    res.send({
      student: student.username,
      schedules: schedules.map(s => ({
        day: s.day,
        startTime: s.startTime,
        endTime: s.endTime,
        classroom: s.classroom,
        subject: s.subject,
        professor: s.Professor.name
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({
      error: 'Error al obtener el horario',
      details: error.message
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { professorId, date, startTime, endTime, reason } = req.body;
    
    // Verificar disponibilidad del profesor
    const existingAppointment = await Appointment.findOne({
      where: {
        professorId,
        date,
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime }
          }
        ]
      }
    });

    if (existingAppointment) {
      return res.status(400).send({ error: 'El profesor ya tiene una cita en ese horario' });
    }

    const appointment = await Appointment.create({
      professorId,
      studentId: req.user.id,
      date,
      startTime,
      endTime,
      reason,
      status: 'pending'
    });

    res.status(201).send(appointment);
  } catch (error) {
    res.status(400).send(error);
  }
};

const downloadSchedulePDF = async (req, res) => {
  try {
    const student = await User.findByPk(req.user.id, {
      include: {
        model: Group,
        through: { attributes: [] },
        include: {
          model: Schedule,
          include: [Professor]
        }
      }
    });

    if (!student.Groups || student.Groups.length === 0) {
      return res.status(404).send({ error: 'No estás asignado a ningún grupo' });
    }

    const groupSchedules = student.Groups[0].Schedules;
    
    // Crear PDF
    const doc = new PDFDocument();
    const filename = `horario-${student.username}.pdf`;
    
    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');
    
    doc.pipe(res);
    doc.fontSize(20).text('Horario de Clases', { align: 'center' });
    doc.moveDown();
    
    groupSchedules.forEach(schedule => {
      doc.fontSize(12)
         .text(`${schedule.day}: ${schedule.startTime} - ${schedule.endTime}`)
         .text(`Materia: ${schedule.subject}`)
         .text(`Aula: ${schedule.classroom}`)
         .text(`Profesor: ${schedule.Professor.name}`)
         .moveDown();
    });
    
    doc.end();
  } catch (error) {
    res.status(500).send(error);
  }
};


const getStudentAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { studentId: req.user.id },
      include: [
        {
          model: Professor,
          attributes: ['id', 'name', 'department']
        }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });
    res.send(appointments);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, reason } = req.body;
    
    const appointment = await Appointment.findOne({
      where: { 
        id,
        studentId: req.user.id 
      }
    });

    if (!appointment) {
      return res.status(404).send({ error: 'Cita no encontrada' });
    }

    // Verificar disponibilidad si se cambia el horario
    if (date || startTime || endTime) {
      const checkDate = date || appointment.date;
      const checkStart = startTime || appointment.startTime;
      const checkEnd = endTime || appointment.endTime;

      const existingAppointment = await Appointment.findOne({
        where: {
          professorId: appointment.professorId,
          date: checkDate,
          id: { [Op.ne]: id },
          [Op.or]: [
            {
              startTime: { [Op.lt]: checkEnd },
              endTime: { [Op.gt]: checkStart }
            }
          ]
        }
      });

      if (existingAppointment) {
        return res.status(400).send({ error: 'El profesor ya tiene una cita en ese horario' });
      }
    }

    await appointment.update({
      date: date || appointment.date,
      startTime: startTime || appointment.startTime,
      endTime: endTime || appointment.endTime,
      reason: reason || appointment.reason
    });

    res.send(appointment);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findOne({
      where: { 
        id,
        studentId: req.user.id 
      }
    });

    if (!appointment) {
      return res.status(404).send({ error: 'Cita no encontrada' });
    }

    await appointment.destroy();
    res.send({ message: 'Cita cancelada correctamente' });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
    getGroupSchedule,
    downloadSchedulePDF,
    getStudentAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
};