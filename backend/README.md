# Backend Karibu Karaoke

Sistema de gestión integral para karaoke desarrollado con Node.js, Express y MongoDB, implementando una arquitectura modular y escalable.

## 📋 Descripción General

Karibu Karaoke Backend es una API RESTful que gestiona todas las operaciones necesarias para el funcionamiento de un karaoke, incluyendo:

- Gestión de pedidos y productos
- Sistema de mesas y reservaciones
- Control de usuarios y autenticación
- Administración de canciones
- Sistema de caja y facturación

## 🏗️ Arquitectura del Sistema

### Capas de la Aplicación

1. **Capa de Entrada**
   - Server.ts: Punto de entrada principal
   - Middlewares de seguridad y validación
   - Sistema de enrutamiento modular

2. **Capa de Negocio**
   - Controladores específicos por dominio
   - Servicios de autenticación y autorización
   - Lógica de negocio modular

3. **Capa de Datos**
   - Modelos MongoDB/Mongoose
   - Utilidades de base de datos
   - Gestión de transacciones

### Modelos Principales

```typescript
// Ejemplos simplificados de los modelos principales

// Usuario
interface IUser {
  nombre: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'cliente';
}

// Pedido
interface IPedido {
  numeroMesa: number;
  clienteId: string;
  detalles: IPedidoDetalle[];
  estado: 'pendiente' | 'en_proceso' | 'completado';
  total: number;
}

// Mesa
interface IMesa {
  numero: number;
  capacidad: number;
  estado: 'disponible' | 'ocupada' | 'reservada';
}
```

## 🔒 Seguridad

### Autenticación
- JWT (JSON Web Tokens)
- Refresh Tokens
- Encriptación de contraseñas con bcrypt

### Autorización
- Sistema de roles (admin, staff, cliente)
- Middleware de verificación por ruta
- Validación de permisos granular

## 🚀 Características Técnicas

### Gestión de Pedidos
- Sistema de estados con transiciones validadas
- Cálculo automático de totales
- Histórico de cambios
- Asignación de trabajadores

### Sistema de Mesas
- Control de estados en tiempo real
- Sistema de reservaciones
- Gestión de capacidad
- Histórico de ocupación

### Gestión de Productos
- Categorización
- Control de stock
- Precios dinámicos
- Imágenes y descripciones

## 📦 Estructura de Directorios Detallada

```
backend/
├── src/
│   ├── config/          # Configuraciones del sistema
│   ├── controllers/     # Controladores de dominio
│   ├── middleware/      # Middlewares personalizados
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   ├── services/        # Servicios de negocio
│   ├── types/           # Tipos TypeScript
│   └── utils/           # Utilidades generales
├── tests/               # Tests unitarios y de integración
└── docs/               # Documentación adicional
```

## 🛠️ Instalación y Configuración

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

## 📚 Documentación Adicional

La documentación detallada de la API y guías adicionales están disponibles en:

- [Documentación API Completa](./docs/API_DOCUMENTATION.md)
- [Guía de Desarrollo](./docs/DEVELOPMENT_GUIDE.md)
- [Guía de Contribución](./docs/CONTRIBUTING.md)

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee nuestra [Guía de Contribución](./docs/CONTRIBUTING.md) antes de enviar un pull request.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.