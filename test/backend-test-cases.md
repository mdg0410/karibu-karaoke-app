# Casos de Prueba del Backend - Karibu Karaoke

Este documento detalla casos de prueba específicos para el backend de la aplicación Karibu Karaoke.

## Pruebas de los Modelos

### 1. Modelo Cliente

| ID | Descripción | Datos de entrada | Resultado esperado |
|----|-------------|------------------|-------------------|
| M01 | Crear cliente con datos válidos | `{ nombre: "Cliente Test", email: "cliente@test.com" }` | Cliente creado correctamente |
| M02 | Crear cliente con email inválido | `{ nombre: "Cliente Test", email: "clientetest.com" }` | Error de validación |
| M03 | Crear cliente con email duplicado | Email ya existente | Error de duplicado |
| M04 | Crear cliente sin nombre | `{ email: "cliente@test.com" }` | Error de validación |

### 2. Modelo Admin

| ID | Descripción | Datos de entrada | Resultado esperado |
|----|-------------|------------------|-------------------|
| M05 | Crear admin con datos válidos | `{ nombre: "Admin Test", email: "admin@test.com", password: "admin123" }` | Admin creado correctamente |
| M06 | Crear admin con contraseña corta | `{ nombre: "Admin Test", email: "admin@test.com", password: "adm" }` | Error de validación |
| M07 | Crear admin con email duplicado | Email ya existente | Error de duplicado |

### 3. Modelo Staff

| ID | Descripción | Datos de entrada | Resultado esperado |
|----|-------------|------------------|-------------------|
| M08 | Crear staff con datos válidos | `{ nombre: "Staff Test", email: "staff@test.com", password: "staff123" }` | Staff creado correctamente |
| M09 | Crear staff con contraseña corta | `{ nombre: "Staff Test", email: "staff@test.com", password: "stf" }` | Error de validación |
| M10 | Crear staff con email duplicado | Email ya existente | Error de duplicado |

## Pruebas de los Controladores

### 1. Controlador Cliente

| ID | Descripción | Datos de entrada | Resultado esperado |
|----|-------------|------------------|-------------------|
| C01 | Generar token para cliente existente | ID de cliente válido | Token JWT generado |
| C02 | Generar token para cliente inexistente | ID de cliente inválido | Error 404 |
| C03 | Crear nuevo cliente | `{ nombre: "Cliente Test", email: "cliente@test.com" }` | Cliente creado y respuesta 201 |

### 2. Controlador Admin

| ID | Descripción | Datos de entrada | Resultado esperado |
|----|-------------|------------------|-------------------|
| C04 | Obtener admin por ID válido | ID de admin válido | Datos del admin y respuesta 200 |
| C05 | Obtener admin por ID inválido | ID de admin inválido | Error 404 |
| C06 | Crear nuevo admin | `{ nombre: "Admin Test", email: "admin@test.com", password: "admin123" }` | Admin creado y respuesta 201 |

### 3. Controlador Staff

| ID | Descripción | Datos de entrada | Resultado esperado |
|----|-------------|------------------|-------------------|
| C07 | Obtener staff por ID válido | ID de staff válido | Datos del staff y respuesta 200 |
| C08 | Obtener staff por ID inválido | ID de staff inválido | Error 404 |
| C09 | Crear nuevo staff | `{ nombre: "Staff Test", email: "staff@test.com", password: "staff123" }` | Staff creado y respuesta 201 |

### 4. Controlador Auth

| ID | Descripción | Datos de entrada | Resultado esperado |
|----|-------------|------------------|-------------------|
| C10 | Login como cliente con email válido | `{ email: "cliente@test.com" }` | Token JWT y respuesta 200 |
| C11 | Login como cliente con email inválido | `{ email: "noexiste@test.com" }` | Error 404 |
| C12 | Login como admin con email válido | `{ email: "admin@test.com" }` | Token JWT y respuesta 200 |
| C13 | Login como admin con email inválido | `{ email: "noexiste@test.com" }` | Error 404 |
| C14 | Login como staff con email válido | `{ email: "staff@test.com" }` | Token JWT y respuesta 200 |
| C15 | Login como staff con email inválido | `{ email: "noexiste@test.com" }` | Error 404 |

## Pruebas de las Rutas

### 1. Ruta Principal `/api`

| ID | Descripción | Método | URL | Resultado esperado |
|----|-------------|--------|-----|-------------------|
| R01 | Verificar que la API está funcionando | GET | `/api` | Mensaje de bienvenida y respuesta 200 |

### 2. Rutas de Cliente

| ID | Descripción | Método | URL | Datos | Resultado esperado |
|----|-------------|--------|-----|-------|-------------------|
| R02 | Crear nuevo cliente | POST | `/api/cliente` | `{ nombre: "Cliente Test", email: "cliente@test.com" }` | Cliente creado y respuesta 201 |
| R03 | Obtener token para cliente | GET | `/api/cliente/:id` | - | Token JWT y respuesta 200 |

### 3. Rutas de Admin

| ID | Descripción | Método | URL | Datos | Resultado esperado |
|----|-------------|--------|-----|-------|-------------------|
| R04 | Crear nuevo admin | POST | `/api/admin` | `{ nombre: "Admin Test", email: "admin@test.com", password: "admin123" }` | Admin creado y respuesta 201 |
| R05 | Obtener admin por ID | GET | `/api/admin/:id` | - | Datos del admin y respuesta 200 |

### 4. Rutas de Staff

| ID | Descripción | Método | URL | Datos | Resultado esperado |
|----|-------------|--------|-----|-------|-------------------|
| R06 | Crear nuevo staff | POST | `/api/staff` | `{ nombre: "Staff Test", email: "staff@test.com", password: "staff123" }` | Staff creado y respuesta 201 |
| R07 | Obtener staff por ID | GET | `/api/staff/:id` | - | Datos del staff y respuesta 200 |

### 5. Rutas de Auth

| ID | Descripción | Método | URL | Datos | Resultado esperado |
|----|-------------|--------|-----|-------|-------------------|
| R08 | Login como cliente | POST | `/api/auth/login/cliente` | `{ email: "cliente@test.com" }` | Token JWT y respuesta 200 |
| R09 | Login como admin | POST | `/api/auth/login/admin` | `{ email: "admin@test.com" }` | Token JWT y respuesta 200 |
| R10 | Login como staff | POST | `/api/auth/login/staff` | `{ email: "staff@test.com" }` | Token JWT y respuesta 200 |

## Utilidades de prueba

Para realizar las pruebas manuales puedes utilizar las siguientes herramientas:

1. **Postman**: Importa la colección de pruebas `/test/postman/karibu-karaoke.postman_collection.json`
2. **cURL**: Ejemplos de comandos en la sección de pruebas del README principal
3. **Thunder Client (extensión de VS Code)**: Importa la colección de pruebas `/test/thunder-client/karibu-karaoke.json`

## Consejos para solucionar problemas

1. **Errores de MongoDB**:
   - Verifica que MongoDB esté en funcionamiento
   - Comprueba que la URI de conexión sea correcta en el archivo `.env`
   - Revisa los logs para ver errores específicos de Mongoose

2. **Errores de JWT**:
   - Asegúrate de que `JWT_SECRET` esté definido en el archivo `.env`
   - Verifica que el token no haya expirado
   - Comprueba que el payload contenga todos los campos necesarios

3. **Errores de HTTPS**:
   - En desarrollo, puedes usar HTTP en lugar de HTTPS con `npm run http-only`
   - Regenera los certificados con `npm run generate-cert`
   - Acepta los certificados autofirmados en el navegador
