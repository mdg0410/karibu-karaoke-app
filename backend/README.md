# Backend de Karibu Karaoke

Este es el servidor backend para la aplicación Karibu Karaoke, desarrollado con Node.js, Express y MongoDB.

## Requisitos previos

- Node.js (v14 o superior)
- MongoDB (local o en la nube)
- npm o yarn

## Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/karibu-karaoke-app.git
cd karibu-karaoke-app/backend
```

2. Instala las dependencias:

```bash
npm install
# o
yarn install
```

3. Copia el archivo `.env.example` a `.env` y configura las variables de entorno:

```bash
cp .env.example .env
```

4. Edita el archivo `.env` con tus configuraciones:

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/karibu_karaoke
JWT_SECRET=tu_clave_secreta_jwt
NODE_ENV=development
```

## Ejecución

### Modo de desarrollo

```bash
npm run dev
# o
yarn dev
```

### Modo de producción

```bash
npm run build
npm start
# o
yarn build
yarn start
```

## Estructura del proyecto

```
src/
  ├── controllers/       # Controladores para manejar la lógica de negocio
  ├── middleware/        # Middleware de autenticación, validación, etc.
  │   ├── auth/          # Funciones de autenticación 
  │   └── validation/    # Funciones de validación
  ├── models/            # Modelos de la base de datos (Mongoose)
  ├── routes/            # Definición de rutas API
  ├── types/             # Definiciones de TypeScript
  ├── utils/             # Utilidades y helpers
  ├── app.ts             # Configuración de la aplicación Express
  ├── server.ts          # Punto de entrada del servidor
  └── config.ts          # Configuraciones del servidor
```

## API

La documentación completa de la API está disponible en el archivo [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## Scripts disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo con hot-reload
- `npm run build`: Compila el código TypeScript a JavaScript
- `npm start`: Inicia el servidor en modo producción
- `npm run lint`: Ejecuta el linter para verificar el código
- `npm run test`: Ejecuta las pruebas unitarias

## Características principales

- Autenticación mediante JWT
- Validación de datos con express-validator
- Base de datos MongoDB con Mongoose
- APIs RESTful
- Soporte para TypeScript
- Autorización basada en roles (admin, trabajador, cliente)
- Gestión de mesas, productos, pedidos, canciones y cierres de caja