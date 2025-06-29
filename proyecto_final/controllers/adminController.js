const { Professor, Schedule, OfficeHour, Group } = require('../models');
const { Op } = require('sequelize'); 

// CRUD para Profesores
const createProfessor = async (req, res) => {
  try {
    const professor = await Professor.create(req.body);
    res.status(201).send(professor);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.findAll();
    res.send(professors);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.id);
    if (!professor) {
      return res.status(404).send({ error: 'Profesor no encontrado.' });
    }
    await professor.update(req.body);
    res.send(professor);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteProfessor = async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.id);
    if (!professor) {
      return res.status(404).send({ error: 'Profesor no encontrado.' });
    }
    await professor.destroy();
    res.send({ message: 'Profesor eliminado correctamente.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// En controllers/adminController.js
const createSchedule = async (req, res) => {
  try {
    const { day, startTime, endTime, classroom, subject, groupId } = req.body;
    const { professorId } = req.params;

    // Validación de campos requeridos
    if (!day || !startTime || !endTime || !classroom || !subject || !groupId) {
      return res.status(400).send({ 
        error: 'Faltan campos requeridos: day, startTime, endTime, classroom, subject, groupId' 
      });
    }

    // Verificar que el profesor existe
    const professor = await Professor.findByPk(professorId);
    if (!professor) {
      return res.status(404).send({ error: 'Profesor no encontrado' });
    }

    // Verificar que el grupo existe
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).send({ error: 'Grupo no encontrado' });
    }

    // Verificar conflicto de horarios
    const existingSchedule = await Schedule.findOne({
      where: {
        groupId,
        day,
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime }
          }
        ]
      }
    });

    if (existingSchedule) {
      return res.status(409).send({ 
        error: 'Conflicto de horario: ya existe una clase para este grupo en ese horario',
        conflictingSchedule: existingSchedule
      });
    }

    const schedule = await Schedule.create({
      day,
      startTime,
      endTime,
      classroom,
      subject,
      professorId,
      groupId
    });

    res.status(201).send(schedule);
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).send({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.scheduleId);
    if (!schedule) {
      return res.status(404).send({ error: 'Horario no encontrado.' });
    }
    await schedule.update(req.body);
    res.send(schedule);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.scheduleId);
    if (!schedule) {
      return res.status(404).send({ error: 'Horario no encontrado.' });
    }
    await schedule.destroy();
    res.send({ message: 'Horario eliminado correctamente.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// CRUD para Horarios de Atención
const createOfficeHour = async (req, res) => {
  try {
    const officeHour = await OfficeHour.create({
      ...req.body,
      professorId: req.params.professorId
    });
    res.status(201).send(officeHour);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateOfficeHour = async (req, res) => {
  try {
    const officeHour = await OfficeHour.findByPk(req.params.officeHourId);
    if (!officeHour) {
      return res.status(404).send({ error: 'Horario de atención no encontrado.' });
    }
    await officeHour.update(req.body);
    res.send(officeHour);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteOfficeHour = async (req, res) => {
  try {
    const officeHour = await OfficeHour.findByPk(req.params.officeHourId);
    if (!officeHour) {
      return res.status(404).send({ error: 'Horario de atención no encontrado.' });
    }
    await officeHour.destroy();
    res.send({ message: 'Horario de atención eliminado correctamente.' });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Agrega estas funciones al final del archivo
const getProfessorSchedules = async (req, res) => {
  try {
    const professorId = req.params.professorId;
    const schedules = await Schedule.findAll({
      where: { professorId },
      attributes: ['id', 'day', 'startTime', 'endTime', 'classroom', 'subject']
    });
    res.send(schedules);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProfessorOfficeHours = async (req, res) => {
  try {
    const professorId = req.params.professorId;
    const officeHours = await OfficeHour.findAll({
      where: { professorId },
      attributes: ['id', 'day', 'startTime', 'endTime', 'location']
    });
    res.send(officeHours);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Asegúrate de exportar las nuevas funciones
module.exports = {
  createProfessor,
  getAllProfessors,
  updateProfessor,
  deleteProfessor,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  createOfficeHour,
  updateOfficeHour,
  deleteOfficeHour,
  getProfessorSchedules,
  getProfessorOfficeHours
};