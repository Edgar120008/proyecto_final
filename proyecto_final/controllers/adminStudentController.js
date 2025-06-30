const { User, Group, UserGroup } = require('../models');
const bcrypt = require('bcryptjs');

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

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    
    const student = await User.findOne({
      where: { 
        id,
        role: 'student' 
      }
    });

    if (!student) {
      return res.status(404).send({ error: 'Estudiante no encontrado' });
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await student.update(updateData);

    // No devolver la contraseña
    const studentData = student.toJSON();
    delete studentData.password;

    res.send(studentData);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await User.findOne({
      where: { 
        id,
        role: 'student' 
      }
    });

    if (!student) {
      return res.status(404).send({ error: 'Estudiante no encontrado' });
    }

    await student.destroy();
    res.send({ message: 'Estudiante eliminado correctamente' });
  } catch (error) {
    res.status(500).send(error);
  }
};

const removeGroupFromStudent = async (req, res) => {
  try {
    const { studentId, groupId } = req.params;
    
    const student = await User.findOne({
      where: { 
        id: studentId,
        role: 'student' 
      }
    });
    
    const group = await Group.findByPk(groupId);

    if (!student || !group) {
      return res.status(404).send({ error: 'Estudiante o grupo no encontrado' });
    }

    await student.removeGroup(group);
    res.send({ message: 'Estudiante removido del grupo correctamente' });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: {
        model: User,
        through: { attributes: [] },
        attributes: ['id', 'username', 'email'],
        where: { role: 'student' }
      }
    });
    res.send(groups);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    
    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).send({ error: 'Grupo no encontrado' });
    }

    await group.destroy();
    res.send({ message: 'Grupo eliminado correctamente' });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllStudents,
  createStudent,
  assignGroupToStudent,
  createGroup,
    updateStudent,
    deleteStudent,
    removeGroupFromStudent,
    getAllGroups,
    deleteGroup
};