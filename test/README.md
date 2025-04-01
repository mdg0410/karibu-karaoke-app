# Documentación de Pruebas - Karibu Karaoke App

Esta documentación detalla los procesos de prueba para verificar la correcta implementación de la aplicación Karibu Karaoke, incluyendo sus interfaces de cliente, administrador y personal.

## Índice

1. [Requisitos previos](#requisitos-previos)
2. [Pruebas de backend](#pruebas-de-backend)
3. [Pruebas de frontend](#pruebas-de-frontend)
4. [Pruebas de integración](#pruebas-de-integración)
5. [Casos de prueba específicos](#casos-de-prueba-específicos)

## Requisitos previos

Antes de comenzar las pruebas, asegúrese de tener:

- Node.js y npm instalados
- MongoDB configurado y funcionando
- Todas las dependencias instaladas mediante `npm run install-all`
- Variables de entorno configuradas correctamente

## Pruebas de backend

### 1. Ejecución de pruebas automatizadas

```bash
cd backend
npm test
```

Esto ejecutará las pruebas unitarias utilizando Jest, verificando el correcto funcionamiento de los controladores, modelos y rutas.

### 2. Verificación manual de la API

#### 2.1. Verificar que el servidor está funcionando

```bash
npm run dev
```

Acceder a `https://localhost:5000/api` debería mostrar un mensaje de bienvenida.

#### 2.2. Pruebas de las rutas de cliente

```bash
# Crear un nuevo cliente
curl -X POST -H "Content-Type: application/json" -d '{"nombre":"Cliente Test","email":"cliente@test.com"}' https://localhost:5000/api/cliente

# Obtener token JWT para un cliente (reemplazar ID_CLIENTE con el ID obtenido)
curl https://localhost:5000/api/cliente/ID_CLIENTE
```

#### 2.3. Pruebas de las rutas de administrador

```bash
# Crear un nuevo administrador
curl -X POST -H "Content-Type: application/json" -d '{"nombre":"Admin Test","email":"admin@test.com","password":"admin123"}' https://localhost:5000/api/admin

# Obtener información de un administrador (reemplazar ID_ADMIN con el ID obtenido)
curl https://localhost:5000/api/admin/ID_ADMIN
```

#### 2.4. Pruebas de las rutas de personal

```bash
# Crear un nuevo miembro del personal
curl -X POST -H "Content-Type: application/json" -d '{"nombre":"Staff Test","email":"staff@test.com","password":"staff123"}' https://localhost:5000/api/staff

# Obtener información de un miembro del personal (reemplazar ID_STAFF con el ID obtenido)
curl https://localhost:5000/api/staff/ID_STAFF
```

#### 2.5. Pruebas de autenticación

```bash
# Login como cliente
curl -X POST -H "Content-Type: application/json" -d '{"email":"cliente@test.com"}' https://localhost:5000/api/auth/login/cliente

# Login como administrador
curl -X POST -H "Content-Type: application/json" -d '{"email":"admin@test.com"}' https://localhost:5000/api/auth/login/admin

# Login como personal
curl -X POST -H "Content-Type: application/json" -d '{"email":"staff@test.com"}' https://localhost:5000/api/auth/login/staff
```

## Pruebas de frontend

### 1. Ejecución de la aplicación

```bash
cd frontend
npm run dev
```

La aplicación debería iniciarse en `http://localhost:3000`.

### 2. Verificación de la página principal

- Verificar que se muestra la página de bienvenida
- Comprobar que los tres portales (Cliente, Admin, Staff) aparecen correctamente
- Verificar que el cambio de idioma funciona adecuadamente

### 3. Navegación y autenticación

Para cada tipo de usuario (Cliente, Admin, Staff):

1. Hacer clic en el botón "Entrar como..."
2. Verificar que se muestra una notificación de éxito
3. Confirmar que se redirige al dashboard correspondiente

## Pruebas de integración

Estas pruebas verifican la comunicación correcta entre el frontend y backend.

### 1. Flujo de registro y autenticación

1. En la página principal, hacer clic en "Entrar como Cliente"
2. Verificar en la consola y en la base de datos que se creó un nuevo cliente
3. Confirmar que se generó un token JWT y se almacenó en localStorage
4. Verificar que la sesión persiste al recargar la página

### 2. Prueba de cierre de sesión

1. Ingresar a cualquier dashboard (Cliente, Admin o Staff)
2. Hacer clic en el nombre de usuario y luego en "Cerrar sesión"
3. Verificar que se redirige a la página principal
4. Confirmar que los datos de sesión se eliminaron del localStorage

## Casos de prueba específicos

### 1. Dashboard de Cliente

#### 1.1. Navegación entre secciones

1. Ingresar como Cliente
2. Verificar que el menú muestra "Bebidas", "Comida", "Canciones"
3. Hacer clic en cada sección y verificar que el contenido cambia
4. Verificar que el indicador de sección activa se actualiza correctamente

#### 1.2. Funcionalidad del carrito

1. Hacer clic en el icono del carrito
2. Verificar que se abre la barra lateral del carrito
3. Hacer clic en el botón de cerrar y verificar que el carrito se oculta

#### 1.3. Perfil y cierre de sesión

1. Hacer clic en el nombre de usuario
2. Verificar que aparece el menú desplegable
3. Hacer clic en "Perfil" y verificar que muestra la información del usuario
4. Hacer clic en "Cerrar sesión" y verificar la redirección

### 2. Dashboard de Administrador

#### 2.1. Navegación entre secciones

1. Ingresar como Admin
2. Verificar que el menú muestra "Mesas", "Pedidos", "Canciones", "Inventario", "Reportes"
3. Hacer clic en cada sección y verificar que el contenido cambia
4. Verificar que el indicador de sección activa se actualiza correctamente

#### 2.2. Cierre de sesión

1. Hacer clic en el nombre de usuario
2. Verificar que aparece el menú desplegable
3. Hacer clic en "Cerrar sesión" y verificar la redirección

### 3. Dashboard de Personal

#### 3.1. Navegación entre secciones

1. Ingresar como Staff
2. Verificar que el menú muestra "Mesas", "Pedidos", "Canciones"
3. Hacer clic en cada sección y verificar que el contenido cambia
4. Verificar que el indicador de sección activa se actualiza correctamente

#### 3.2. Cierre de sesión

1. Hacer clic en el nombre de usuario
2. Verificar que aparece el menú desplegable
3. Hacer clic en "Cerrar sesión" y verificar la redirección

## Resolución de problemas comunes

### Problema: Error de CORS

**Solución**: Verificar que el proxy en `vite.config.js` esté correctamente configurado y que el servidor esté usando CORS.

### Problema: No se puede conectar a MongoDB

**Solución**: Verificar que la cadena de conexión en `.env` sea correcta y que MongoDB esté en ejecución.

### Problema: Errores de certificado SSL

**Solución**: En desarrollo, usar `npm run http-only` para ejecutar el servidor sin HTTPS, o generar nuevos certificados con `npm run generate-cert`.
