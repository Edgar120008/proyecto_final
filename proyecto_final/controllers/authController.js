const jwt = require('jsonwebtoken');
const { User } = require('../models');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.validPassword(password))) {
      return res.status(401).send({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '8h'
    });

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

const register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const user = await User.create({ username, password, email, role });
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { login, register };