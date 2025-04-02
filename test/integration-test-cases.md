# Casos de Prueba de Integración - Karibu Karaoke

Este documento detalla casos de prueba específicos para la integración entre el frontend y el backend de la aplicación Karibu Karaoke.

## Pruebas de Autenticación

### 1. Flujo de creación de usuario y login

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| I01 | Crear cliente y autenticar | 1. En la página principal, hacer clic en "Entrar como Cliente"<br>2. Verificar la respuesta del backend | - Usuario creado en la base de datos<br>- Token JWT generado<br>- Token almacenado en localStorage<br>- Redirección al dashboard |
| I02 | Crear admin y autenticar | 1. En la página principal, hacer clic en "Entrar como Admin"<br>2. Verificar la respuesta del backend | - Usuario creado en la base de datos<br>- Token JWT generado<br>- Token almacenado en localStorage<br>- Redirección al dashboard |
| I03 | Crear staff y autenticar | 1. En la página principal, hacer clic en "Entrar como Staff"<br>2. Verificar la respuesta del backend | - Usuario creado en la base de datos<br>- Token JWT generado<br>- Token almacenado en localStorage<br>- Redirección al dashboard |

### 2. Validación de sesión

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| I04 | Persistencia de sesión | 1. Iniciar sesión como cualquier tipo de usuario<br>2. Recargar la página | - La sesión se mantiene<br>- No hay redirección a la página principal |
| I05 | Cierre de sesión | 1. Iniciar sesión<br>2. Hacer clic en el nombre de usuario<br>3. Hacer clic en "Cerrar sesión" | - Token eliminado de localStorage<br>- Redirección a la página principal |

### 3. Acceso no autorizado

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| I06 | Acceso directo a dashboard de Cliente sin autenticación | 1. Cerrar sesión si está iniciada<br>2. Intentar acceder a /client directamente en la URL | Redirección a la página principal |
| I07 | Acceso directo a dashboard de Admin sin autenticación | 1. Cerrar sesión si está iniciada<br>2. Intentar acceder a /admin directamente en la URL | Redirección a la página principal |
| I08 | Acceso directo a dashboard de Staff sin autenticación | 1. Cerrar sesión si está iniciada<br>2. Intentar acceder a /staff directamente en la URL | Redirección a la página principal |
| I09 | Acceso a dashboard de Admin como Cliente | 1. Iniciar sesión como Cliente<br>2. Intentar acceder a /admin directamente en la URL | Redirección a la página principal |
| I10 | Acceso a dashboard de Staff como Cliente | 1. Iniciar sesión como Cliente<br>2. Intentar acceder a /staff directamente en la URL | Redirección a la página principal |
| I11 | Acceso a dashboard de Cliente como Admin | 1. Iniciar sesión como Admin<br>2. Intentar acceder a /client directamente en la URL | Redirección a la página principal |

## Pruebas de Notificaciones

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| I12 | Notificación de éxito en creación de usuario | 1. En la página principal, hacer clic en cualquier botón "Entrar como..." | Se muestra un toast de éxito con mensaje relevante |
| I13 | Notificación de error en autenticación | 1. Modificar el código para forzar un error de autenticación<br>2. Hacer clic en cualquier botón "Entrar como..." | Se muestra un toast de error con mensaje descriptivo |

## Pruebas de Errores de Conexión

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| I14 | Error de conexión al servidor | 1. Detener el servidor backend<br>2. Intentar iniciar sesión | - Se muestra un toast de error<br>- Mensaje de error descriptivo en la consola |
| I15 | Error de conexión a MongoDB | 1. Modificar la URI de MongoDB para provocar un error<br>2. Intentar iniciar sesión | - Error en el servidor backend<br>- Se muestra un toast de error en el frontend |

## Procedimientos para pruebas manuales

### Verificación completa de la integración Cliente

1. Iniciar los servidores frontend y backend:
   ```bash
   npm run dev
   ```

2. Abrir la aplicación en el navegador (http://localhost:3000)

3. Hacer clic en "Entrar como Cliente"

4. Verificar en la consola del navegador que:
   - Se realiza una petición POST a `/api/cliente`
   - Se realiza una petición POST a `/api/auth/login/cliente`
   - Se recibe un token JWT

5. Abrir la consola de MongoDB (o una herramienta como MongoDB Compass) y verificar que:
   - Se ha creado un nuevo documento en la colección `clientes`
   - El documento contiene los datos correctos (nombre, email)

6. Verificar en el navegador que:
   - Se ha redirigido al dashboard de cliente
   - El nombre de usuario aparece en la esquina superior derecha
   - Las secciones de navegación funcionan correctamente

7. Verificar la persistencia:
   - Recargar la página
   - Confirmar que sigue en el dashboard de cliente
   - Revisar localStorage para verificar que el token JWT está almacenado

8. Cerrar sesión:
   - Hacer clic en el nombre de usuario
   - Hacer clic en "Cerrar sesión"
   - Verificar que se redirecciona a la página principal
   - Verificar que no hay token JWT en localStorage

### Verificación completa de la integración Admin y Staff

Seguir los mismos pasos que para el Cliente, pero haciendo clic en "Entrar como Admin" o "Entrar como Staff" según corresponda, y verificando las colecciones `admins` o `staffs` en MongoDB.

## Herramientas útiles para pruebas de integración

### 1. Herramientas del navegador

- **DevTools de Chrome/Firefox**: Para inspeccionar solicitudes de red, localStorage y consola
- **React Developer Tools**: Para explorar el estado de componentes React y las props
- **Redux DevTools** (si se implementa Redux): Para verificar los cambios de estado

### 2. Herramientas de API

- **Postman**: Para probar las API del backend directamente
- **Thunder Client (VS Code)**: Alternativa ligera a Postman integrada en VS Code

### 3. Herramientas de base de datos

- **MongoDB Compass**: Para verificar los documentos creados en la base de datos
- **MongoDB Atlas Dashboard**: Si se usa MongoDB Atlas como servicio

## Resolución de problemas comunes

### Problema: Error CORS en solicitudes al backend

**Solución**:
1. Verificar que el servidor backend tiene habilitado CORS
2. Comprobar que el proxy en `vite.config.js` está configurado correctamente
3. Asegurarse de que las URLs utilizadas en las solicitudes son relativas (comienzan con `/api/`)

### Problema: Token JWT no funciona o expira rápidamente

**Solución**:
1. Verificar que `JWT_SECRET` en `.env` es consistente
2. Comprobar que `JWT_EXPIRES_IN` tiene un valor razonable (ej. `1d`)
3. Verificar que el token se almacena correctamente en localStorage

### Problema: Credenciales incorrectas al iniciar sesión

**Solución**:
1. Verificar que el usuario existe en la base de datos
2. Comprobar que se está enviando el email correcto
3. Verificar los logs del backend para ver errores específicos
