-- Crear la base de datos
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

-- Crear usuario para la aplicación (opcional pero recomendado)
CREATE USER IF NOT EXISTS 'ship_user'@'localhost' IDENTIFIED BY 'ship_password';
GRANT ALL PRIVILEGES ON ship_database.* TO 'ship_user'@'localhost';
FLUSH PRIVILEGES;