# Documentación de la API de Karibu Karaoke

Esta documentación describe los endpoints disponibles en la API de Karibu Karaoke, incluyendo los parámetros requeridos, respuestas esperadas y ejemplos de uso.

## Índice

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Mesas](#mesas)
4. [Productos](#productos)
5. [Canciones](#canciones)
6. [Pedidos](#pedidos)
7. [Lista de Canciones](#lista-de-canciones)
8. [Historial de Cierre](#historial-de-cierre)

## Autenticación

La API utiliza autenticación basada en tokens JWT. Primero debe autenticarse para obtener un token, que luego debe incluirse en todas las solicitudes posteriores en el encabezado `Authorization`.

### Iniciar sesión

Autentica un usuario y devuelve un token JWT.

- **URL**: `/api/auth/login`
- **Método**: `POST`
- **Requiere autenticación**: No

#### Parámetros de solicitud

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### Respuestas

- **Éxito (200 OK)**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "nombre": "Nombre de Usuario",
    "email": "usuario@ejemplo.com",
    "rol": "admin"
  }
}
```

- **Error (401 Unauthorized)**

```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

### Registrar usuario

Crea un nuevo usuario.

- **URL**: `/api/auth/registro`
- **Método**: `POST`
- **Requiere autenticación**: No

#### Parámetros de solicitud

```json
{
  "nombre": "Nuevo Usuario",
  "email": "nuevo@ejemplo.com",
  "password": "contraseña123",
  "telefono": "123456789",
  "rol": "cliente"
}
```

#### Respuestas

- **Éxito (201 Created)**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "nombre": "Nuevo Usuario",
    "email": "nuevo@ejemplo.com",
    "rol": "cliente"
  }
}
```

- **Error (400 Bad Request)**

```json
{
  "success": false,
  "message": "El email ya está en uso"
}
```

## Usuarios

### Obtener todos los usuarios

Recupera una lista paginada de usuarios.

- **URL**: `/api/usuarios`
- **Método**: `GET`
- **Requiere autenticación**: Sí, rol 'admin'

#### Parámetros de consulta

- `page`: Número de página (por defecto: 1)
- `limit`: Número de elementos por página (por defecto: 10)
- `sort`: Campo para ordenar (por defecto: 'createdAt')
- `order`: Dirección de ordenamiento ('asc' o 'desc', por defecto: 'desc')
- `rol`: Filtrar por rol ('admin', 'trabajador', 'cliente')
- `search`: Buscar por nombre o email

#### Respuestas

- **Éxito (200 OK)**

```json
{
  "success": true,
  "data": {
    "usuarios": [
      {
        "id": "60d21b4667d0d8992e610c85",
        "nombre": "Nombre de Usuario",
        "email": "usuario@ejemplo.com",
        "telefono": "123456789",
        "rol": "admin",
        "createdAt": "2023-04-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

### Obtener usuario por ID

Recupera la información de un usuario específico.

- **URL**: `/api/usuarios/:id`
- **Método**: `GET`
- **Requiere autenticación**: Sí, rol 'admin' o el propio usuario

#### Respuestas

- **Éxito (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "nombre": "Nombre de Usuario",
    "email": "usuario@ejemplo.com",
    "telefono": "123456789",
    "rol": "admin",
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

- **Error (404 Not Found)**

```json
{
  "success": false,
  "message": "Usuario no encontrado"
}
```

## Pedidos

### Crear un nuevo pedido

Crea un nuevo pedido con múltiples productos.

- **URL**: `/api/pedidos`
- **Método**: `POST`
- **Requiere autenticación**: Sí, roles 'cliente', 'staff', o 'admin'

#### Parámetros de solicitud

```json
{
  "mesaId": "60d21b4667d0d8992e610c85",
  "productos": [
    {
      "productoId": "60d21b4667d0d8992e610c86",
      "cantidad": 2
    },
    {
      "productoId": "60d21b4667d0d8992e610c87",
      "cantidad": 1
    }
  ],
  "observaciones": "Sin cebolla en la hamburguesa"
}
```

#### Respuestas

- **Éxito (201 Created)**

```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": "60d21b4667d0d8992e610c88",
    "mesaId": "60d21b4667d0d8992e610c85",
    "productos": [
      {
        "productoId": "60d21b4667d0d8992e610c86",
        "nombre": "Hamburguesa",
        "cantidad": 2,
        "precioUnitario": 5.99,
        "subtotal": 11.98
      },
      {
        "productoId": "60d21b4667d0d8992e610c87",
        "nombre": "Refresco",
        "cantidad": 1,
        "precioUnitario": 1.99,
        "subtotal": 1.99
      }
    ],
    "total": 13.97,
    "observaciones": "Sin cebolla en la hamburguesa",
    "estado": "pendiente",
    "createdAt": "2023-04-01T12:00:00.000Z"
  }
}
```

- **Error (400 Bad Request)**

```json
{
  "success": false,
  "message": "La mesa especificada no existe"
}
```

### Obtener todos los pedidos

Recupera una lista de pedidos con filtros opcionales.

- **URL**: `/api/pedidos`
- **Método**: `GET`
- **Requiere autenticación**: Sí, roles 'staff' o 'admin'

#### Parámetros de consulta

- `estado`: Filtrar por estado del pedido ('pendiente', 'en preparación', 'completado')
- `mesaId`: Filtrar por ID de mesa
- `fechaDesde`: Filtrar desde fecha (formato ISO)
- `fechaHasta`: Filtrar hasta fecha (formato ISO)

#### Respuestas

- **Éxito (200 OK)**

```json
{
  "success": true,
  "data": [
    {
      "id": "60d21b4667d0d8992e610c88",
      "mesaId": "60d21b4667d0d8992e610c85",
      "productos": [
        {
          "productoId": "60d21b4667d0d8992e610c86",
          "nombre": "Hamburguesa",
          "cantidad": 2,
          "precioUnitario": 5.99,
          "subtotal": 11.98
        },
        {
          "productoId": "60d21b4667d0d8992e610c87",
          "nombre": "Refresco",
          "cantidad": 1,
          "precioUnitario": 1.99,
          "subtotal": 1.99
        }
      ],
      "total": 13.97,
      "estado": "pendiente",
      "createdAt": "2023-04-01T12:00:00.000Z"
    }
  ]
}
```

- **Error (400 Bad Request)**

```json
{
  "success": false,
  "message": "Parámetros de consulta inválidos"
}
```

## Historial de Cierre

El historial de cierre se utiliza para gestionar las aperturas y cierres de caja en el sistema.

### Obtener todos los historiales de cierre

Recupera una lista paginada de historiales de cierre.

- **URL**: `/api/historial-cierre`
- **Método**: `GET`
- **Requiere autenticación**: Sí, rol 'admin' o 'trabajador'

#### Parámetros de consulta

- `page`: Número de página (por defecto: 1)
- `limit`: Número de elementos por página (por defecto: 10)
- `sortBy`: Campo para ordenar (por defecto: 'createdAt')
- `sortOrder`: Dirección de ordenamiento ('asc' o 'desc', por defecto: 'desc')
- `abierto`: Filtrar por estado de apertura (true/false)
- `fechaDesde`: Filtrar desde fecha (formato ISO)
- `fechaHasta`: Filtrar hasta fecha (formato ISO)

#### Respuestas

- **Éxito (200 OK)**

```json
{
  "success": true,
  "data": {
    "historiales": [
      {
        "id": "60d21b4667d0d8992e610c85",
        "cajaInicial": 500,
        "cajaFinal": 1200,
        "efectivoReal": 1150,
        "efectivoCalculado": 1200,
        "diferencia": -50,
        "ventasEfectivo": 700,
        "ventasTarjeta": 300,
        "totalVentas": 1000,
        "totalIngresado": 1000,
        "usuarioApertura": {
          "id": "60d21b4667d0d8992e610c86",
          "nombre": "Admin Usuario"
        },
        "usuarioCierre": {
          "id": "60d21b4667d0d8992e610c86",
          "nombre": "Admin Usuario"
        },
        "fechaApertura": "2023-04-01T08:00:00.000Z",
        "fechaCierre": "2023-04-01T20:00:00.000Z",
        "abierto": false,
        "observaciones": "Cierre diario normal",
        "createdAt": "2023-04-01T08:00:00.000Z",
        "updatedAt": "2023-04-01T20:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 30,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

### Obtener historial de cierre por ID

Recupera la información de un historial de cierre específico.

- **URL**: `/api/historial-cierre/:id`
- **Método**: `GET`
- **Requiere autenticación**: Sí, rol 'admin' o 'trabajador'

#### Respuestas

- **Éxito (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "cajaInicial": 500,
    "cajaFinal": 1200,
    "efectivoReal": 1150,
    "efectivoCalculado": 1200,
    "diferencia": -50,
    "ventasEfectivo": 700,
    "ventasTarjeta": 300,
    "totalVentas": 1000,
    "totalIngresado": 1000,
    "usuarioApertura": {
      "id": "60d21b4667d0d8992e610c86",
      "nombre": "Admin Usuario"
    },
    "usuarioCierre": {
      "id": "60d21b4667d0d8992e610c86",
      "nombre": "Admin Usuario"
    },
    "fechaApertura": "2023-04-01T08:00:00.000Z",
    "fechaCierre": "2023-04-01T20:00:00.000Z",
    "abierto": false,
    "observaciones": "Cierre diario normal",
    "createdAt": "2023-04-01T08:00:00.000Z",
    "updatedAt": "2023-04-01T20:00:00.000Z"
  }
}
```

### Obtener historial de cierre actual (abierto)

Recupera la información del historial de cierre actualmente abierto.

- **URL**: `/api/historial-cierre/actual`
- **Método**: `GET`
- **Requiere autenticación**: Sí, rol 'admin' o 'trabajador'

#### Respuestas

- **Éxito (200 OK)**

```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c87",
    "cajaInicial": 500,
    "cajaFinal": 0,
    "efectivoReal": 0,
    "efectivoCalculado": 0,
    "diferencia": 0,
    "ventasEfectivo": 0,
    "ventasTarjeta": 0,
    "totalVentas": 0,
    "totalIngresado": 0,
    "usuarioApertura": {
      "id": "60d21b4667d0d8992e610c86",
      "nombre": "Admin Usuario"
    },
    "fechaApertura": "2023-04-02T08:00:00.000Z",
    "abierto": true,
    "observaciones": "Apertura diaria",
    "createdAt": "2023-04-02T08:00:00.000Z",
    "updatedAt": "2023-04-02T08:00:00.000Z"
  }
}
```

- **Error (404 Not Found)**

```json
{
  "success": false,
  "message": "No hay un historial de cierre abierto actualmente"
}
```

### Crear un nuevo historial de cierre (apertura)

Crea un nuevo historial de cierre (apertura de caja).

- **URL**: `/api/historial-cierre`
- **Método**: `POST`
- **Requiere autenticación**: Sí, rol 'admin' o 'trabajador'

#### Parámetros de solicitud

```json
{
  "cajaInicial": 500,
  "observaciones": "Apertura diaria"
}
```

#### Respuestas

- **Éxito (201 Created)**

```json
{
  "success": true,
  "message": "Historial de cierre creado exitosamente",
  "data": {
    "id": "60d21b4667d0d8992e610c87",
    "cajaInicial": 500,
    "usuarioApertura": {
      "id": "60d21b4667d0d8992e610c86",
      "nombre": "Admin Usuario"
    },
    "fechaApertura": "2023-04-02T08:00:00.000Z",
    "abierto": true,
    "observaciones": "Apertura diaria",
    "createdAt": "2023-04-02T08:00:00.000Z",
    "updatedAt": "2023-04-02T08:00:00.000Z"
  }
}
```

- **Error (400 Bad Request)**

```json
{
  "success": false,
  "message": "Ya existe un historial de cierre abierto. Debe cerrarlo antes de crear uno nuevo.",
  "historialId": "60d21b4667d0d8992e610c87"
}
```

### Cerrar un historial de cierre

Cierra un historial de cierre existente.

- **URL**: `/api/historial-cierre/:id/cerrar`
- **Método**: `PATCH`
- **Requiere autenticación**: Sí, rol 'admin' o 'trabajador'

#### Parámetros de solicitud

```json
{
  "cajaFinal": 1200,
  "efectivoReal": 1150,
  "observaciones": "Cierre diario normal"
}
```

#### Respuestas

- **Éxito (200 OK)**

```json
{
  "success": true,
  "message": "Historial de cierre cerrado exitosamente",
  "data": {
    "id": "60d21b4667d0d8992e610c87",
    "cajaInicial": 500,
    "cajaFinal": 1200,
    "efectivoReal": 1150,
    "efectivoCalculado": 1200,
    "diferencia": -50,
    "ventasEfectivo": 700,
    "ventasTarjeta": 300,
    "totalVentas": 1000,
    "totalIngresado": 1000,
    "usuarioApertura": {
      "id": "60d21b4667d0d8992e610c86",
      "nombre": "Admin Usuario"
    },
    "usuarioCierre": {
      "id": "60d21b4667d0d8992e610c86",
      "nombre": "Admin Usuario"
    },
    "fechaApertura": "2023-04-02T08:00:00.000Z",
    "fechaCierre": "2023-04-02T20:00:00.000Z",
    "abierto": false,
    "observaciones": "Cierre diario normal",
    "createdAt": "2023-04-02T08:00:00.000Z",
    "updatedAt": "2023-04-02T20:00:00.000Z"
  }
}
```

- **Error (404 Not Found)**

```json
{
  "success": false,
  "message": "Historial de cierre no encontrado"
}
```

- **Error (400 Bad Request)**

```json
{
  "success": false,
  "message": "Este historial de cierre ya está cerrado"
}
```

### Actualizar un historial de cierre

Actualiza la información de un historial de cierre existente.

- **URL**: `/api/historial-cierre/:id`
- **Método**: `PUT`
- **Requiere autenticación**: Sí, rol 'admin'

#### Parámetros de solicitud

```json
{
  "cajaInicial": 550,
  "observaciones": "Apertura diaria actualizada",
  "abierto": true
}
```

#### Respuestas

- **Éxito (200 OK)**

```json
{
  "success": true,
  "message": "Historial de cierre actualizado exitosamente",
  "data": {
    "id": "60d21b4667d0d8992e610c87",
    "cajaInicial": 550,
    "fechaApertura": "2023-04-02T08:00:00.000Z",
    "abierto": true,
    "observaciones": "Apertura diaria actualizada",
    "usuarioApertura": {
      "id": "60d21b4667d0d8992e610c86",
      "nombre": "Admin Usuario"
    },
    "createdAt": "2023-04-02T08:00:00.000Z",
    "updatedAt": "2023-04-02T10:00:00.000Z"
  }
}
```

### Eliminar un historial de cierre

Elimina un historial de cierre.

- **URL**: `/api/historial-cierre/:id`
- **Método**: `DELETE`
- **Requiere autenticación**: Sí, rol 'admin'

#### Respuestas

- **Éxito (200 OK)**

```json
{
  "success": true,
  "message": "Historial de cierre eliminado exitosamente"
}
```

## Consideraciones generales

- Todas las peticiones a los endpoints protegidos deben incluir el token JWT en el encabezado `Authorization` con el formato `Bearer [token]`.
- Las respuestas de error incluyen el campo `message` con una descripción del problema.
- Las respuestas exitosas incluyen el campo `success: true` y, cuando corresponde, un objeto `data` con los datos solicitados.
- Las operaciones de listado admiten paginación mediante los parámetros `page` y `limit`.
- La mayoría de los endpoints de listado permiten filtrado mediante parámetros de consulta específicos.