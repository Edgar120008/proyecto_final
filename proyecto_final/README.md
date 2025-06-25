# SHIP - Sistema de Horarios e Información de Profesores

## Descripción 📋

SHIP es un sistema de información web desarrollado para la ESCOM que permite a los alumnos consultar los horarios de clase y atención de los profesores. El sistema incluye:

- Módulo de consulta para alumnos
- Módulo de administración para gestión de datos
- API RESTful desarrollada con Node.js, Express y Sequelize
- Base de datos MySQL

## Requisitos Previos 📦

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- Postman (para probar los endpoints)

## Instalación 🚀

1. Clonar el repositorio:
   ```bash
   git clone [url-del-repositorio]
   cd ship-api
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar la base de datos:
   - Ejecutar el script SQL proporcionado en `script_bd.sql`
   - O usar Sequelize para crear la estructura:
     ```bash
     npx sequelize-cli db:create
     npx sequelize-cli db:migrate
     npx sequelize-cli db:seed:all
     ```

4. Configurar variables de entorno:
   Crear un archivo `.env` en la raíz del proyecto con:
   ```
   DB_USER=root
   DB_PASSWORD=RooT1234
   DB_NAME=ship_database
   DB_HOST=localhost
   JWT_SECRET=Ja1M3_SecretKey
   PORT=3000
   ```

5. Iniciar el servidor:
   ```bash
   npm run dev
   ```

## Estructura de la Base de Datos 🗄️

```sql
CREATE DATABASE IF NOT EXISTS ship_database;
USE ship_database;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
) ENGINE=InnoDB;

-- Tabla de Profesores
CREATE TABLE IF NOT EXISTS Professors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
) ENGINE=InnoDB;

-- Tabla de Horarios de Clase
CREATE TABLE IF NOT EXISTS Schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado') NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    classroom VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    professorId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (professorId) REFERENCES Professors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabla de Horarios de Atención
CREATE TABLE IF NOT EXISTS OfficeHours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado') NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    location VARCHAR(100) NOT NULL,
    professorId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (professorId) REFERENCES Professors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Usuario para la aplicación
CREATE USER IF NOT EXISTS 'ship_user'@'localhost' IDENTIFIED BY 'ship_password';
GRANT ALL PRIVILEGES ON ship_database.* TO 'ship_user'@'localhost';
FLUSH PRIVILEGES;
```

## Endpoints de la API 🌐

Consulta el archivo [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para la documentación completa de los endpoints disponibles.

## Datos Iniciales 🌱

El sistema incluye datos de prueba que se cargan automáticamente:

- **Usuarios:**
  - Admin: `username: admin`, `password: password123`
  - Estudiante: `username: student1`, `password: password123`

- **Profesores:** 4 profesores con sus respectivos horarios

## Configuración Recomendada ⚙️

Para desarrollo, se recomienda:

1. Usar `sync({ force: true })` en la primera ejecución
2. Luego cambiar a `sync({ alter: true })` para desarrollo
3. En producción, usar migraciones manuales:
   ```bash
   npx sequelize-cli db:migrate
   ```
