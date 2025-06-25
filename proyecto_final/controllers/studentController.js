const { Professor, Schedule, OfficeHour } = require('../models');

const getAllProfessors = async (req, res) => {
  try {
    const professors = await Professor.findAll({
      attributes: ['id', 'name', 'email', 'department']
    });
    res.send(professors);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProfessorSchedules = async (req, res) => {
  try {
    const professorId = req.params.id;
    const schedules = await Schedule.findAll({
      where: { professorId },
      attributes: ['day', 'startTime', 'endTime', 'classroom', 'subject']
    });
    res.send(schedules);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getProfessorOfficeHours = async (req, res) => {
  try {
    const professorId = req.params.id;
    const officeHours = await OfficeHour.findAll({
      where: { professorId },
      attributes: ['day', 'startTime', 'endTime', 'location']
    });
    res.send(officeHours);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllProfessors,
  getProfessorSchedules,
  getProfessorOfficeHours
};