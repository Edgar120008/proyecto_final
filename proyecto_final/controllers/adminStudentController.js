const { User, Group, UserGroup } = require('../models');

const getAllStudents = async (req, res) => {
  try {
    const students = await User.findAll({
      where: { role: 'student' },
      attributes: ['id', 'username', 'email', 'createdAt'],
      include: {
        model: Group,
        through: { attributes: [] }
      }
    });
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createStudent = async (req, res) => {
  try {
    const { username, password, email, groupId } = req.body;
    
    const student = await User.create({
      username,
      password,
      email,
      role: 'student'
    });

    if (groupId) {
      const group = await Group.findByPk(groupId);
      if (group) {
        await student.addGroup(group);
      }
    }

    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
};

const assignGroupToStudent = async (req, res) => {
  try {
    const { studentId, groupId } = req.params;
    
    const student = await User.findOne({
      where: { id: studentId, role: 'student' }
    });
    const group = await Group.findByPk(groupId);

    if (!student || !group) {
      return res.status(404).send({ error: 'Estudiante o grupo no encontrado' });
    }

    // Verificar capacidad del grupo
    const currentCount = await group.countUsers();
    if (currentCount >= group.maxCapacity) {
      return res.status(400).send({ error: 'El grupo ha alcanzado su capacidad máxima' });
    }

    await student.addGroup(group);
    res.send({ message: 'Estudiante asignado al grupo correctamente' });
  } catch (error) {
    res.status(500).send(error);
  }
};

const createGroup = async (req, res) => {
  try {
    const { name, maxCapacity = 10 } = req.body;
    const group = await Group.create({ name, maxCapacity });
    res.status(201).send(group);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getAllStudents,
  createStudent,
  assignGroupToStudent,
  createGroup
};