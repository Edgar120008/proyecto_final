SIHP - Sistema de Información de Horarios de Profesores (Frontend)
Este proyecto es la interfaz de usuario (frontend) para el Sistema de Información de Horarios de Profesores (SIHP). Está construido con React y utiliza Vite como entorno de desarrollo. La aplicación permite a dos tipos de usuarios (administradores y estudiantes) interactuar con un sistema de gestión de horarios.

Características Principales
Autenticación por Roles: Sistema de login que diferencia entre usuarios admin y student.

Rutas Protegidas: Cada rol tiene acceso únicamente a las secciones que le corresponden.

Vista de Estudiante: Permite a los estudiantes buscar profesores y consultar sus horarios de clase y de atención de manera eficiente.

Vista de Administrador: Un panel completo para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre:

Profesores

Horarios de Clase

Horarios de Atención

Interfaz Responsiva: Diseñada con Bootstrap para funcionar correctamente en dispositivos móviles, tabletas y computadoras de escritorio.

Comunicación Asíncrona: Todas las interacciones con la base de datos se realizan a través de una API REST, sin recargar la página.

Requisitos Previos
Para ejecutar este proyecto, necesitarás tener instalado lo siguiente en tu sistema:

Node.js y npm: Puedes descargarlo desde nodejs.org.

El Servidor Backend: Este proyecto es solo el frontend y requiere que el backend esté funcionando para poder autenticarse y obtener los datos.

Guía de Instalación y Ejecución
Sigue estos pasos para poner en marcha el proyecto en tu máquina local.

1. Configurar el Backend
Antes de iniciar el frontend, asegúrate de que el servidor del backend esté iniciado y escuchando en la siguiente dirección:

[http://127.0.0.1:3000](http://127.0.0.1:3000)

Si tu backend corre en una dirección o puerto diferente, deberás actualizarlo en el archivo de configuración del frontend (ver paso 3).

2. Clonar y Preparar el Frontend
Abre tu terminal y ejecuta los siguientes comandos:

# 1. Clona (o descarga y descomprime) el repositorio en tu máquina
# git clone [URL_DEL_REPOSITORIO]

# 2. Navega al directorio del proyecto
cd sihp-frontend

# 3. Instala todas las dependencias necesarias del proyecto
npm install

3. Verificar la Conexión con la API
El frontend se conectará a la API del backend. La URL base está configurada en el siguiente archivo:

src/api/apiService.js

Abre este archivo y verifica que la baseURL coincida con la dirección de tu servidor backend. Por defecto, está configurada así:

const apiClient = axios.create({
  baseURL: '[http://127.0.0.1:3000/api](http://127.0.0.1:3000/api)',
});

Si tu backend está en otro puerto (por ejemplo, 8080), ajústalo aquí.

4. Ejecutar el Servidor de Desarrollo
Una vez que las dependencias estén instaladas y el backend esté corriendo, inicia el servidor de desarrollo de Vite:

npm run dev

Esto iniciará la aplicación en modo de desarrollo. Abre tu navegador y visita la URL que te indique la terminal (generalmente http://localhost:5173).

Scripts Disponibles
En el directorio del proyecto, puedes ejecutar los siguientes comandos:

npm run dev: Inicia la aplicación en modo de desarrollo.

npm run build: Compila la aplicación para producción en la carpeta dist.

npm run lint: Ejecuta el linter para revisar la calidad del código.

npm run preview: Sirve localmente la versión de producción que se encuentra en la carpeta dist.

Tecnologías Utilizadas
Framework: React

Herramientas de Build: Vite

Estilos: React-Bootstrap & Bootstrap 5

Enrutamiento: React Router DOM

Peticiones HTTP: Axios

Iconos: Lucide React

Manejo de JWT: jwt-decode