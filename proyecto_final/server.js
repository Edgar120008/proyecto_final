const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

// Sincronizar modelos con la base de datos y luego iniciar el servidor
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al sincronizar con la base de datos:', error);
  });