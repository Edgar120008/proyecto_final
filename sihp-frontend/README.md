# README - Aplicación React con Vite

## Descripción
Este proyecto es una aplicación frontend construida con React y Vite que se conecta a un backend local en `http://127.0.0.1:3000`.

## Requisitos previos
- Node.js (versión 16 o superior recomendada)
- npm o yarn (se recomienda npm v7+ o yarn v1.22+)
- Backend ejecutándose en `http://127.0.0.1:3000`

## Instalación

1. Clona el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Navega al directorio del proyecto:
```bash
cd [NOMBRE_DEL_DIRECTORIO]
```

3. Instala las dependencias:
```bash
npm install
# o
yarn install
```

## Configuración

El proyecto ya está configurado para conectarse al backend en `http://127.0.0.1:3000`. Si necesitas cambiar esta configuración:

1. Crea un archivo `.env` en la raíz del proyecto basado en `.env.example` (si existe)
2. Modifica la variable de entorno:
```env
VITE_API_URL=http://127.0.0.1:3000
```

## Ejecución

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173) (o el puerto que indique Vite al iniciar).

## Construcción para producción

Para crear una versión optimizada para producción:

```bash
npm run build
# o
yarn build
```

Los archivos de producción se generarán en la carpeta `dist/`.

## Estructura del proyecto

```
/
├── public/          # Archivos estáticos
├── src/             # Código fuente
│   ├── assets/      # Recursos (imágenes, fuentes, etc.)
│   ├── components/  # Componentes React
│   ├── pages/       # Páginas/views
│   ├── services/    # Lógica para conectar con el backend
│   ├── App.jsx      # Componente principal
│   └── main.jsx     # Punto de entrada
├── .env.example     # Ejemplo de variables de entorno
├── vite.config.js   # Configuración de Vite
└── package.json     # Dependencias y scripts
```

## Conexión con el backend

La aplicación está configurada para hacer peticiones al backend en `http://127.0.0.1:3000`. Asegúrate de que:

1. El backend esté en ejecución antes de iniciar el frontend
2. El backend tenga configurado CORS para aceptar peticiones del frontend

## Solución de problemas

Si tienes problemas de conexión con el backend:
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador para ver errores de CORS
3. Asegúrate de que no haya conflictos de puertos

## Licencia

[MIT](LICENSE) (o especifica tu licencia aquí)
