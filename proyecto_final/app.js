const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminStudentRoutes = require('./routes/adminStudentRoutes');
const studentScheduleRoutes = require('./routes/studentScheduleRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminStudentRoutes);
app.use('/api/student', studentScheduleRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

module.exports = app;