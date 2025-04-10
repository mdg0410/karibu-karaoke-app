# Documentación API Karibu Karaoke

Esta documentación detalla todos los endpoints disponibles en la API de Karibu Karaoke, incluyendo información sobre autenticación, formatos de petición y respuesta, y casos de uso específicos para cada ruta.

## Índice

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Mesas](#mesas)
4. [Productos](#productos)
5. [Pedidos](#pedidos)
6. [Canciones](#canciones)
7. [Lista de Canciones](#lista-de-canciones)
8. [Historial de Cierre](#historial-de-cierre)

## Autenticación

Todas las rutas protegidas requieren un token JWT que debe enviarse en el encabezado de autorización:

```
Authorization: Bearer <tu_token_jwt>
```

Los tokens son válidos por 24 horas. Para obtener un token, utiliza las rutas de login.

### Roles de Usuario

- **cliente**: Acceso básico para clientes del karaoke
- **trabajador**: Personal del establecimiento con permisos especiales
- **admin**: Acceso total al sistema

## Usuarios

### Registro de Usuario

**Endpoint:** `POST /api/usuarios/registro`

**Acceso:** Público

**Descripción:** Registra un nuevo usuario en el sistema

**Body:**
```json
{
  "nombre": "Nombre Usuario",
  "email": "usuario@example.com",
  "password": "contraseña123",
  "telefono": "123456789",
  "rol": "cliente" // Opcional: Por defecto es "cliente"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "<jwt_token>",
  "user": {
    "id": "<user_id>",
    "nombre": "Nombre Usuario",
    "email": "usuario@example.com",
    "rol": "cliente"
  }
}
```

### Iniciar Sesión

**Endpoint:** `POST /api/usuarios/login`

**Acceso:** Público

**Descripción:** Autentica al usuario y devuelve un token JWT

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "token": "<jwt_token>",
  "user": {
    "id": "<user_id>",
    "nombre": "Nombre Usuario",
    "email": "usuario@example.com",
    "rol": "cliente"
  }
}
```

### Obtener Perfil

**Endpoint:** `GET /api/usuarios/perfil`

**Acceso:** Usuario autenticado

**Descripción:** Devuelve el perfil del usuario autenticado

**Respuesta Exitosa:**
```json
{
  "success": true,
  "usuario": {
    "id": "<user_id>",
    "nombre": "Nombre Usuario",
    "email": "usuario@example.com",
    "telefono": "123456789",
    "rol": "cliente",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
}
```

### Actualizar Usuario

**Endpoint:** `PUT /api/usuarios/:id`

**Acceso:** Admin o propietario de la cuenta

**Descripción:** Actualiza la información de un usuario

**Body:**
```json
{
  "nombre": "Nombre Actualizado",
  "email": "nuevo@example.com",
  "telefono": "987654321",
  "rol": "cliente"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Usuario actualizado exitosamente",
  "usuario": {
    "id": "<user_id>",
    "nombre": "Nombre Actualizado",
    "email": "nuevo@example.com",
    "telefono": "987654321",
    "rol": "cliente",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-02T12:00:00.000Z"
  }
}
```

### Cambiar Contraseña

**Endpoint:** `PUT /api/usuarios/cambiar-password/:id`

**Acceso:** Admin o propietario de la cuenta

**Descripción:** Actualiza la contraseña de un usuario

**Body:**
```json
{
  "currentPassword": "contraseña_actual",
  "newPassword": "nueva_contraseña"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

### Obtener Lista de Usuarios

**Endpoint:** `GET /api/usuarios`

**Acceso:** Admin

**Descripción:** Devuelve una lista paginada de usuarios

**Parámetros de consulta:**
- `page`: Número de página (por defecto: 1)
- `limit`: Número de usuarios por página (por defecto: 10)
- `nombre`: Filtrar por nombre
- `email`: Filtrar por email
- `rol`: Filtrar por rol (cliente, trabajador, admin)
- `fechaDesde`: Filtrar por fecha de creación (después de)
- `fechaHasta`: Filtrar por fecha de creación (antes de)
- `sortBy`: Campo para ordenar (por defecto: nombre)
- `order`: Orden (asc o desc, por defecto: asc)

**Respuesta Exitosa:**
```json
{
  "success": true,
  "usuarios": [
    {
      "id": "<user_id>",
      "nombre": "Nombre Usuario",
      "email": "usuario@example.com",
      "telefono": "123456789",
      "rol": "cliente",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Obtener Usuario por ID

**Endpoint:** `GET /api/usuarios/:id`

**Acceso:** Admin

**Descripción:** Devuelve la información de un usuario específico

**Respuesta Exitosa:**
```json
{
  "success": true,
  "usuario": {
    "id": "<user_id>",
    "nombre": "Nombre Usuario",
    "email": "usuario@example.com",
    "telefono": "123456789",
    "rol": "cliente",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
}
```

### Eliminar Usuario

**Endpoint:** `DELETE /api/usuarios/:id`

**Acceso:** Admin

**Descripción:** Elimina un usuario del sistema

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

## Mesas

### Obtener Todas las Mesas

**Endpoint:** `GET /api/mesas`

**Acceso:** Admin, Trabajador

**Descripción:** Devuelve una lista de todas las mesas

**Parámetros de consulta:**
- Filtros disponibles: estado, capacidad mínima, etc.

**Respuesta Exitosa:**
```json
{
  "success": true,
  "mesas": [
    {
      "id": "<mesa_id>",
      "numero": 1,
      "capacidad": 4,
      "estado": "disponible",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  ]
}
```

### Obtener Mesas Disponibles

**Endpoint:** `GET /api/mesas/disponibles`

**Acceso:** Usuario autenticado

**Descripción:** Devuelve una lista de mesas disponibles

**Respuesta Exitosa:**
```json
{
  "success": true,
  "mesas": [
    {
      "id": "<mesa_id>",
      "numero": 1,
      "capacidad": 4,
      "estado": "disponible",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  ]
}
```

### Obtener Mesa por ID

**Endpoint:** `GET /api/mesas/:id`

**Acceso:** Usuario autenticado

**Descripción:** Devuelve la información de una mesa específica

**Respuesta Exitosa:**
```json
{
  "success": true,
  "mesa": {
    "id": "<mesa_id>",
    "numero": 1,
    "capacidad": 4,
    "estado": "disponible",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
}
```

### Crear Mesa

**Endpoint:** `POST /api/mesas`

**Acceso:** Admin

**Descripción:** Crea una nueva mesa

**Body:**
```json
{
  "numero": 5,
  "capacidad": 6,
  "estado": "disponible"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Mesa creada exitosamente",
  "mesa": {
    "id": "<mesa_id>",
    "numero": 5,
    "capacidad": 6,
    "estado": "disponible",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
}
```

### Actualizar Mesa

**Endpoint:** `PUT /api/mesas/:id`

**Acceso:** Admin

**Descripción:** Actualiza la información de una mesa

**Body:**
```json
{
  "numero": 5,
  "capacidad": 8,
  "estado": "disponible"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Mesa actualizada exitosamente",
  "mesa": {
    "id": "<mesa_id>",
    "numero": 5,
    "capacidad": 8,
    "estado": "disponible",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-02T12:00:00.000Z"
  }
}
```

### Cambiar Estado de Mesa

**Endpoint:** `PUT /api/mesas/:id/estado`

**Acceso:** Admin, Trabajador, Cliente

**Descripción:** Actualiza el estado de una mesa

**Body:**
```json
{
  "estado": "ocupada",
  "usuarioId": "67f75dd99fb28b61bf95c3a2"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Estado de mesa actualizado exitosamente",
  "mesa": {
    "id": "<mesa_id>",
    "numero": 5,
    "capacidad": 8,
    "estado": "ocupada",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-02T13:00:00.000Z"
  }
}
```

### Obtener Historial de Mesa

**Endpoint:** `GET /api/mesas/:id/historial`

**Acceso:** Admin, Trabajador

**Descripción:** Devuelve el historial de cambios de una mesa

**Respuesta Exitosa:**
```json
{
  "success": true,
  "historial": [
    {
      "fecha": "2023-01-01T13:00:00.000Z",
      "estadoAnterior": "disponible",
      "estadoNuevo": "ocupada",
      "trabajadorId": "<user_id>",
      "trabajadorNombre": "Nombre Trabajador"
    }
  ]
}
```

### Eliminar Mesa

**Endpoint:** `DELETE /api/mesas/:id`

**Acceso:** Admin

**Descripción:** Elimina una mesa

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Mesa eliminada exitosamente"
}
```

## Productos

### Obtener Todos los Productos

**Endpoint:** `GET /api/productos`

**Acceso:** Público

**Descripción:** Devuelve una lista paginada de productos

**Parámetros de consulta:**
- `page`: Número de página (por defecto: 1)
- `limit`: Número de productos por página (por defecto: 10)
- `nombre`: Filtrar por nombre
- `categoria`: Filtrar por categoría
- `estado`: Filtrar por estado (disponible, agotado)
- `precioMin`: Precio mínimo
- `precioMax`: Precio máximo
- `stockMin`: Stock mínimo
- `stockMax`: Stock máximo
- `sortBy`: Campo para ordenar (por defecto: nombre)
- `order`: Orden (asc o desc, por defecto: asc)

**Respuesta Exitosa:**
```json
{
  "productos": [
    {
      "id": "<producto_id>",
      "nombre": "Producto 1",
      "categoria": "bebida",
      "precio": 5.99,
      "imagenURL": "ruta/imagen.jpg",
      "stock": 50,
      "estado": "disponible",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Obtener Producto por ID

**Endpoint:** `GET /api/productos/:id`

**Acceso:** Público

**Descripción:** Devuelve la información de un producto específico

**Respuesta Exitosa:**
```json
{
  "producto": {
    "id": "<producto_id>",
    "nombre": "Producto 1",
    "categoria": "bebida",
    "precio": 5.99,
    "imagenURL": "ruta/imagen.jpg",
    "stock": 50,
    "estado": "disponible",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
}
```

### Obtener Productos por Categoría

**Endpoint:** `GET /api/productos/categoria/:categoria`

**Acceso:** Público

**Descripción:** Devuelve productos filtrados por categoría

**Respuesta Exitosa:**
```json
{
  "productos": [
    {
      "id": "<producto_id>",
      "nombre": "Producto 1",
      "categoria": "bebida",
      "precio": 5.99,
      "imagenURL": "ruta/imagen.jpg",
      "stock": 50,
      "estado": "disponible",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Obtener Categorías

**Endpoint:** `GET /api/productos/categorias`

**Acceso:** Público

**Descripción:** Devuelve un listado de categorías de productos

**Respuesta Exitosa:**
```json
{
  "categorias": ["bebida", "comida", "postre"]
}
```

### Crear Producto

**Endpoint:** `POST /api/productos`

**Acceso:** Admin

**Descripción:** Crea un nuevo producto

**Body:**
```json
{
  "nombre": "Nuevo Producto",
  "categoria": "bebida",
  "precio": 8.99,
  "imagenURL": "ruta/nueva-imagen.jpg",
  "stock": 100,
  "estado": "disponible"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Producto creado exitosamente",
  "producto": {
    "id": "<producto_id>",
    "nombre": "Nuevo Producto",
    "categoria": "bebida",
    "precio": 8.99,
    "imagenURL": "ruta/nueva-imagen.jpg",
    "stock": 100,
    "estado": "disponible",
    "createdAt": "2023-01-02T12:00:00.000Z",
    "updatedAt": "2023-01-02T12:00:00.000Z"
  }
}
```

### Actualizar Producto

**Endpoint:** `PUT /api/productos/:id`

**Acceso:** Admin

**Descripción:** Actualiza la información de un producto

**Body:**
```json
{
  "nombre": "Producto Actualizado",
  "categoria": "bebida",
  "precio": 9.99,
  "imagenURL": "ruta/imagen-actualizada.jpg",
  "stock": 80
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Producto actualizado exitosamente",
  "producto": {
    "id": "<producto_id>",
    "nombre": "Producto Actualizado",
    "categoria": "bebida",
    "precio": 9.99,
    "imagenURL": "ruta/imagen-actualizada.jpg",
    "stock": 80,
    "estado": "disponible",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-02T14:00:00.000Z"
  }
}
```

### Cambiar Estado de Producto

**Endpoint:** `PATCH /api/productos/:id/estado`

**Acceso:** Admin

**Descripción:** Actualiza el estado de un producto

**Body:**
```json
{
  "estado": "agotado"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Estado del producto actualizado exitosamente",
  "producto": {
    "id": "<producto_id>",
    "nombre": "Producto Actualizado",
    "categoria": "bebida",
    "precio": 9.99,
    "imagenURL": "ruta/imagen-actualizada.jpg",
    "stock": 0,
    "estado": "agotado",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-02T15:00:00.000Z"
  }
}
```

### Eliminar Producto

**Endpoint:** `DELETE /api/productos/:id`

**Acceso:** Admin

**Descripción:** Elimina un producto

**Respuesta Exitosa:**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

## Pedidos

### Crear Pedido

**Endpoint:** `POST /api/pedidos`

**Acceso:** Cliente, Staff, Admin

**Descripción:** Crea un nuevo pedido

**Body:**
```json
{
  "numeroMesa": 5,
  "clienteId": "<user_id>",
  "detalles": [
    {
      "productoId": "<producto_id>",
      "cantidad": 2,
      "precioUnitario": 5.99
    }
  ],
  "estado": "pendiente"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Pedido creado exitosamente",
  "pedido": {
    "id": "<pedido_id>",
    "numeroMesa": 5,
    "clienteId": "<user_id>",
    "detalles": [
      {
        "productoId": "<producto_id>",
        "cantidad": 2,
        "precioUnitario": 5.99,
        "subtotal": 11.98
      }
    ],
    "estado": "pendiente",
    "total": 11.98,
    "createdAt": "2023-01-02T12:00:00.000Z",
    "updatedAt": "2023-01-02T12:00:00.000Z"
  }
}
```

### Obtener Pedidos

**Endpoint:** `GET /api/pedidos`

**Acceso:** Staff, Admin

**Descripción:** Devuelve una lista paginada de pedidos

**Parámetros de consulta:**
- `page`: Número de página (por defecto: 1)
- `limit`: Número de pedidos por página (por defecto: 10)
- `numeroMesa`: Filtrar por número de mesa
- `clienteId`: Filtrar por cliente
- `estado`: Filtrar por estado (pendiente, en_proceso, completado, cancelado)
- `fechaDesde`: Filtrar por fecha (después de)
- `fechaHasta`: Filtrar por fecha (antes de)
- `trabajadorId`: Filtrar por trabajador asignado
- `totalMin`: Total mínimo
- `totalMax`: Total máximo
- `sortBy`: Campo para ordenar (por defecto: createdAt)
- `order`: Orden (asc o desc, por defecto: desc)

**Respuesta Exitosa:**
```json
{
  "pedidos": [
    {
      "id": "<pedido_id>",
      "numeroMesa": 5,
      "clienteId": "<user_id>",
      "cliente": {
        "nombre": "Nombre Cliente",
        "email": "cliente@example.com"
      },
      "detalles": [
        {
          "productoId": "<producto_id>",
          "producto": {
            "nombre": "Producto 1"
          },
          "cantidad": 2,
          "precioUnitario": 5.99,
          "subtotal": 11.98
        }
      ],
      "estado": "pendiente",
      "total": 11.98,
      "createdAt": "2023-01-02T12:00:00.000Z",
      "updatedAt": "2023-01-02T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Obtener Pedido por ID

**Endpoint:** `GET /api/pedidos/:id`

**Acceso:** Usuario autenticado

**Descripción:** Devuelve la información de un pedido específico

**Respuesta Exitosa:**
```json
{
  "pedido": {
    "id": "<pedido_id>",
    "numeroMesa": 5,
    "clienteId": "<user_id>",
    "cliente": {
      "nombre": "Nombre Cliente",
      "email": "cliente@example.com"
    },
    "detalles": [
      {
        "productoId": "<producto_id>",
        "producto": {
          "nombre": "Producto 1",
          "categoria": "bebida"
        },
        "cantidad": 2,
        "precioUnitario": 5.99,
        "subtotal": 11.98
      }
    ],
    "estado": "pendiente",
    "total": 11.98,
    "historialCambios": [],
    "createdAt": "2023-01-02T12:00:00.000Z",
    "updatedAt": "2023-01-02T12:00:00.000Z"
  }
}
```

### Actualizar Pedido

**Endpoint:** `PUT /api/pedidos/:id`

**Acceso:** Staff, Admin

**Descripción:** Actualiza la información de un pedido

**Body:**
```json
{
  "estado": "en_proceso",
  "detalles": [
    {
      "productoId": "<producto_id>",
      "cantidad": 3,
      "precioUnitario": 5.99
    },
    {
      "productoId": "<producto_id_2>",
      "cantidad": 1,
      "precioUnitario": 4.50
    }
  ],
  "comentario": "Actualización de pedido"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Pedido actualizado exitosamente",
  "pedido": {
    "id": "<pedido_id>",
    "numeroMesa": 5,
    "clienteId": "<user_id>",
    "detalles": [
      {
        "productoId": "<producto_id>",
        "cantidad": 3,
        "precioUnitario": 5.99,
        "subtotal": 17.97
      },
      {
        "productoId": "<producto_id_2>",
        "cantidad": 1,
        "precioUnitario": 4.50,
        "subtotal": 4.50
      }
    ],
    "estado": "en_proceso",
    "total": 22.47,
    "historialCambios": [
      {
        "trabajadorId": "<user_id>",
        "fechaCambio": "2023-01-02T14:00:00.000Z",
        "estadoAnterior": "pendiente",
        "estadoNuevo": "en_proceso",
        "comentario": "Actualización de pedido"
      }
    ],
    "createdAt": "2023-01-02T12:00:00.000Z",
    "updatedAt": "2023-01-02T14:00:00.000Z"
  }
}
```

### Cambiar Estado de Pedido

**Endpoint:** `PATCH /api/pedidos/:id/estado`

**Acceso:** Staff, Admin

**Descripción:** Actualiza el estado de un pedido

**Body:**
```json
{
  "estado": "completado",
  "trabajadorId": "<user_id>",
  "comentario": "Pedido entregado"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Estado del pedido actualizado exitosamente",
  "pedido": {
    "id": "<pedido_id>",
    "numeroMesa": 5,
    "clienteId": "<user_id>",
    "estado": "completado",
    "total": 22.47,
    "historialCambios": [
      {
        "trabajadorId": "<user_id>",
        "fechaCambio": "2023-01-02T14:00:00.000Z",
        "estadoAnterior": "pendiente",
        "estadoNuevo": "en_proceso",
        "comentario": "Actualización de pedido"
      },
      {
        "trabajadorId": "<user_id>",
        "fechaCambio": "2023-01-02T15:00:00.000Z",
        "estadoAnterior": "en_proceso",
        "estadoNuevo": "completado",
        "comentario": "Pedido entregado"
      }
    ],
    "updatedAt": "2023-01-02T15:00:00.000Z"
  }
}
```

### Agregar Producto a Pedido

**Endpoint:** `POST /api/pedidos/:id/productos`

**Acceso:** Cliente, Staff, Admin

**Descripción:** Agrega un producto a un pedido existente

**Body:**
```json
{
  "productoId": "<producto_id_3>",
  "cantidad": 2,
  "precioUnitario": 3.50
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Producto agregado al pedido exitosamente",
  "pedido": {
    "id": "<pedido_id>",
    "numeroMesa": 5,
    "clienteId": "<user_id>",
    "detalles": [
      {
        "productoId": "<producto_id>",
        "cantidad": 3,
        "precioUnitario": 5.99,
        "subtotal": 17.97
      },
      {
        "productoId": "<producto_id_2>",
        "cantidad": 1,
        "precioUnitario": 4.50,
        "subtotal": 4.50
      },
      {
        "productoId": "<producto_id_3>",
        "cantidad": 2,
        "precioUnitario": 3.50,
        "subtotal": 7.00
      }
    ],
    "estado": "en_proceso",
    "total": 29.47,
    "updatedAt": "2023-01-02T15:30:00.000Z"
  }
}
```

### Eliminar Pedido

**Endpoint:** `DELETE /api/pedidos/:id`

**Acceso:** Admin

**Descripción:** Elimina un pedido

**Respuesta Exitosa:**
```json
{
  "message": "Pedido eliminado exitosamente"
}
```

## Canciones

### Obtener Todas las Canciones

**Endpoint:** `GET /api/canciones`

**Acceso:** Usuario autenticado

**Descripción:** Devuelve una lista paginada de canciones

**Parámetros de consulta:**
- Filtros disponibles: nombre, artista, género, idioma, popularidad, etc.

**Respuesta Exitosa:**
```json
{
  "canciones": [
    {
      "id": "<cancion_id>",
      "numeroCancion": "001",
      "titulo": "Canción 1",
      "artista": "Artista 1",
      "genero": "Pop",
      "idioma": "Español",
      "duracion": 180,
      "popularidad": 10,
      "estado": "activa",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 10,
    "totalPages": 100
  }
}
```

### Obtener Canciones Populares

**Endpoint:** `GET /api/canciones/populares`

**Acceso:** Usuario autenticado

**Descripción:** Devuelve una lista de canciones ordenadas por popularidad

**Respuesta Exitosa:**
```json
{
  "canciones": [
    {
      "id": "<cancion_id>",
      "numeroCancion": "001",
      "titulo": "Canción Popular",
      "artista": "Artista Popular",
      "genero": "Pop",
      "idioma": "Español",
      "duracion": 180,
      "popularidad": 100,
      "estado": "activa"
    }
  ]
}
```

### Obtener Géneros

**Endpoint:** `GET /api/canciones/generos`

**Acceso:** Usuario autenticado

**Descripción:** Devuelve una lista de géneros musicales disponibles

**Respuesta Exitosa:**
```json
{
  "generos": ["Pop", "Rock", "Ranchera", "Balada", "Salsa"]
}
```

### Obtener Idiomas

**Endpoint:** `GET /api/canciones/idiomas`

**Acceso:** Usuario autenticado

**Descripción:** Devuelve una lista de idiomas disponibles para las canciones

**Respuesta Exitosa:**
```json
{
  "idiomas": ["Español", "Inglés", "Portugués", "Francés"]
}
```

### Obtener Canción por ID

**Endpoint:** `GET /api/canciones/:id`

**Acceso:** Usuario autenticado

**Descripción:** Devuelve la información de una canción específica

**Respuesta Exitosa:**
```json
{
  "cancion": {
    "id": "<cancion_id>",
    "numeroCancion": "001",
    "titulo": "Canción 1",
    "artista": "Artista 1",
    "genero": "Pop",
    "idioma": "Español",
    "duracion": 180,
    "popularidad": 10,
    "estado": "activa",
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
}
```

### Crear Canción

**Endpoint:** `POST /api/canciones`

**Acceso:** Admin

**Descripción:** Crea una nueva canción

**Body:**
```json
{
  "numeroCancion": "999",
  "titulo": "Nueva Canción",
  "artista": "Nuevo Artista",
  "genero": "Rock",
  "idioma": "Español",
  "duracion": 210,
  "popularidad": 0,
  "estado": "activa"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Canción creada exitosamente",
  "cancion": {
    "id": "<cancion_id>",
    "numeroCancion": "999",
    "titulo": "Nueva Canción",
    "artista": "Nuevo Artista",
    "genero": "Rock",
    "idioma": "Español",
    "duracion": 210,
    "popularidad": 0,
    "estado": "activa",
    "createdAt": "2023-01-02T12:00:00.000Z",
    "updatedAt": "2023-01-02T12:00:00.000Z"
  }
}
```

### Actualizar Canción

**Endpoint:** `PUT /api/canciones/:id`

**Acceso:** Admin

**Descripción:** Actualiza la información de una canción

**Body:**
```json
{
  "titulo": "Canción Actualizada",
  "artista": "Artista Actualizado",
  "genero": "Pop",
  "idioma": "Español",
  "duracion": 195,
  "estado": "activa"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Canción actualizada exitosamente",
  "cancion": {
    "id": "<cancion_id>",
    "numeroCancion": "999",
    "titulo": "Canción Actualizada",
    "artista": "Artista Actualizado",
    "genero": "Pop",
    "idioma": "Español",
    "duracion": 195,
    "popularidad": 0,
    "estado": "activa",
    "createdAt": "2023-01-02T12:00:00.000Z",
    "updatedAt": "2023-01-02T14:00:00.000Z"
  }
}
```

### Incrementar Popularidad de Canción

**Endpoint:** `PUT /api/canciones/:id/popularidad`

**Acceso:** Admin, Trabajador

**Descripción:** Incrementa el contador de popularidad de una canción

**Respuesta Exitosa:**
```json
{
  "message": "Popularidad de canción incrementada exitosamente",
  "cancion": {
    "id": "<cancion_id>",
    "numeroCancion": "999",
    "titulo": "Canción Actualizada",
    "artista": "Artista Actualizado",
    "popularidad": 1,
    "estado": "activa",
    "updatedAt": "2023-01-02T15:00:00.000Z"
  }
}
```

### Eliminar Canción

**Endpoint:** `DELETE /api/canciones/:id`

**Acceso:** Admin

**Descripción:** Elimina una canción

**Respuesta Exitosa:**
```json
{
  "message": "Canción eliminada exitosamente"
}
```

## Lista de Canciones

### Obtener Listas de Canciones

**Endpoint:** `GET /api/lista-canciones`

**Acceso:** Usuario autenticado (cliente ve solo sus listas, admin y trabajador ven todas)

**Descripción:** Devuelve una lista paginada de listas de canciones

**Parámetros de consulta:**
- `page`: Número de página (por defecto: 1)
- `limit`: Cantidad por página (por defecto: 10)
- `numeroMesa`: Filtrar por número de mesa
- `clienteId`: Filtrar por cliente
- `estadoReproduccion`: Filtrar por estado de reproducción (pendiente, reproduciendo, completada)
- `estadoPago`: Filtrar por estado de pago (pendiente, pagada)
- `fechaInicio`: Filtrar por fecha (después de)
- `fechaFin`: Filtrar por fecha (antes de)
- `incluirCanciones`: Incluir detalles de las canciones (true o false)

**Respuesta Exitosa:**
```json
{
  "listasCanciones": [
    {
      "id": "<lista_id>",
      "numeroMesa": 5,
      "clienteId": "<user_id>",
      "cliente": {
        "nombre": "Nombre Cliente"
      },
      "canciones": ["001", "002", "003"],
      "estadoReproduccion": "pendiente",
      "estadoPago": "pendiente",
      "createdAt": "2023-01-02T12:00:00.000Z",
      "updatedAt": "2023-01-02T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Obtener Listas por Mesa

**Endpoint:** `GET /api/lista-canciones/mesa/:numeroMesa`

**Acceso:** Admin, Trabajador

**Descripción:** Devuelve todas las listas de canciones de una mesa específica

**Respuesta Exitosa:**
```json
{
  "count": 2,
  "listasCanciones": [
    {
      "id": "<lista_id>",
      "numeroMesa": 5,
      "clienteId": "<user_id>",
      "cliente": {
        "nombre": "Nombre Cliente"
      },
      "canciones": ["001", "002", "003"],
      "estadoReproduccion": "pendiente",
      "estadoPago": "pendiente",
      "createdAt": "2023-01-02T12:00:00.000Z"
    },
    {
      "id": "<lista_id_2>",
      "numeroMesa": 5,
      "clienteId": "<user_id>",
      "cliente": {
        "nombre": "Nombre Cliente"
      },
      "canciones": ["004", "005"],
      "estadoReproduccion": "pendiente",
      "estadoPago": "pendiente",
      "createdAt": "2023-01-02T13:00:00.000Z"
    }
  ]
}
```

### Obtener Lista de Canciones por ID

**Endpoint:** `GET /api/lista-canciones/:id`

**Acceso:** Admin, Trabajador, Propietario de la lista

**Descripción:** Devuelve la información de una lista específica

**Parámetros de consulta:**
- `incluirCanciones`: Incluir detalles de las canciones (true o false)

**Respuesta Exitosa:**
```json
{
  "listaCancion": {
    "id": "<lista_id>",
    "numeroMesa": 5,
    "clienteId": "<user_id>",
    "cliente": {
      "nombre": "Nombre Cliente",
      "email": "cliente@example.com"
    },
    "canciones": [
      {
        "numeroCancion": "001",
        "titulo": "Canción 1",
        "artista": "Artista 1",
        "genero": "Pop",
        "idioma": "Español"
      },
      {
        "numeroCancion": "002",
        "titulo": "Canción 2",
        "artista": "Artista 2",
        "genero": "Rock",
        "idioma": "Inglés"
      }
    ],
    "estadoReproduccion": "pendiente",
    "estadoPago": "pendiente",
    "createdAt": "2023-01-02T12:00:00.000Z",
    "updatedAt": "2023-01-02T12:00:00.000Z"
  }
}
```

### Crear Lista de Canciones

**Endpoint:** `POST /api/lista-canciones`

**Acceso:** Usuario autenticado

**Descripción:** Crea una nueva lista de canciones

**Body:**
```json
{
  "numeroMesa": 5,
  "clienteId": "<user_id>",
  "canciones": ["001", "002", "003"],
  "estadoReproduccion": "pendiente",
  "estadoPago": "pendiente"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Lista de canciones creada exitosamente",
  "listaCancion": {
    "id": "<lista_id>",
    "numeroMesa": 5,
    "clienteId": "<user_id>",
    "canciones": [
      {
        "numeroCancion": "001",
        "titulo": "Canción 1",
        "artista": "Artista 1"
      },
      {
        "numeroCancion": "002",
        "titulo": "Canción 2",
        "artista": "Artista 2"
      },
      {
        "numeroCancion": "003",
        "titulo": "Canción 3",
        "artista": "Artista 3"
      }
    ],
    "estadoReproduccion": "pendiente",
    "estadoPago": "pendiente",
    "createdAt": "2023-01-02T12:00:00.000Z",
    "updatedAt": "2023-01-02T12:00:00.000Z"
  }
}
```

### Actualizar Lista de Canciones

**Endpoint:** `PUT /api/lista-canciones/:id`

**Acceso:** Admin, Trabajador

**Descripción:** Actualiza una lista de canciones

**Body:**
```json
{
  "canciones": ["001", "002", "004"],
  "estadoReproduccion": "reproduciendo"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Lista de canciones actualizada exitosamente",
  "listaCancion": {
    "id": "<lista_id>",
    "numeroMesa": 5,
    "clienteId": "<user_id>",
    "canciones": [
      {
        "numeroCancion": "001",
        "titulo": "Canción 1",
        "artista": "Artista 1"
      },
      {
        "numeroCancion": "002",
        "titulo": "Canción 2",
        "artista": "Artista 2"
      },
      {
        "numeroCancion": "004",
        "titulo": "Canción 4",
        "artista": "Artista 4"
      }
    ],
    "estadoReproduccion": "reproduciendo",
    "estadoPago": "pendiente",
    "updatedAt": "2023-01-02T14:00:00.000Z"
  }
}
```

### Cambiar Estado de Reproducción

**Endpoint:** `PATCH /api/lista-canciones/:id/estado-reproduccion`

**Acceso:** Admin, Trabajador

**Descripción:** Actualiza el estado de reproducción de una lista

**Body:**
```json
{
  "estadoReproduccion": "completada"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Estado de reproducción cambiado a completada",
  "listaCancion": {
    "id": "<lista_id>",
    "numeroMesa": 5,
    "clienteId": "<user_id>",
    "estadoReproduccion": "completada",
    "estadoPago": "pendiente",
    "updatedAt": "2023-01-02T15:00:00.000Z"
  }
}
```

### Cambiar Estado de Pago

**Endpoint:** `PATCH /api/lista-canciones/:id/estado-pago`

**Acceso:** Admin, Trabajador

**Descripción:** Actualiza el estado de pago de una lista

**Body:**
```json
{
  "estadoPago": "pagada"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Estado de pago cambiado a pagada",
  "listaCancion": {
    "id": "<lista_id>",
    "numeroMesa": 5,
    "clienteId": "<user_id>",
    "estadoReproduccion": "completada",
    "estadoPago": "pagada",
    "updatedAt": "2023-01-02T16:00:00.000Z"
  }
}
```

### Eliminar Lista de Canciones

**Endpoint:** `DELETE /api/lista-canciones/:id`

**Acceso:** Admin

**Descripción:** Elimina una lista de canciones

**Respuesta Exitosa:**
```json
{
  "message": "Lista de canciones eliminada exitosamente"
}
```

## Historial de Cierre

### Obtener Historiales de Cierre

**Endpoint:** `GET /api/historial-cierre`

**Acceso:** Admin, Trabajador

**Descripción:** Devuelve una lista paginada de historiales de cierre

**Parámetros de consulta:**
- `page`: Número de página (por defecto: 1)
- `limit`: Cantidad por página (por defecto: 10)
- `abierto`: Filtrar por estado (true o false)
- `fechaDesde`: Filtrar por fecha de apertura (después de)
- `fechaHasta`: Filtrar por fecha de apertura (antes de)

**Respuesta Exitosa:**
```json
{
  "success": true,
  "data": {
    "historiales": [
      {
        "_id": "<historial_id>",
        "cajaInicial": 1000,
        "cajaFinal": 1500,
        "efectivoCalculado": 1500,
        "efectivoReal": 1495,
        "diferencia": -5,
        "ventasEfectivo": 500,
        "ventasTarjeta": 300,
        "totalVentas": 800,
        "totalIngresado": 800,
        "fechaApertura": "2023-01-01T08:00:00.000Z",
        "fechaCierre": "2023-01-01T20:00:00.000Z",
        "usuarioApertura": {
          "_id": "<user_id>",
          "nombre": "Nombre Trabajador"
        },
        "usuarioCierre": {
          "_id": "<user_id>",
          "nombre": "Nombre Trabajador"
        },
        "abierto": false,
        "observaciones": "Cierre normal de caja"
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

### Obtener Historial de Cierre Actual (Abierto)

**Endpoint:** `GET /api/historial-cierre/actual`

**Acceso:** Admin, Trabajador

**Descripción:** Devuelve el historial de cierre actualmente abierto

**Respuesta Exitosa:**
```json
{
  "success": true,
  "data": {
    "_id": "<historial_id>",
    "cajaInicial": 1000,
    "usuarioApertura": {
      "_id": "<user_id>",
      "nombre": "Nombre Trabajador"
    },
    "fechaApertura": "2023-01-02T08:00:00.000Z",
    "abierto": true,
    "observaciones": "Apertura de caja"
  }
}
```

### Obtener Historial de Cierre por ID

**Endpoint:** `GET /api/historial-cierre/:id`

**Acceso:** Admin, Trabajador

**Descripción:** Devuelve un historial de cierre específico

**Respuesta Exitosa:**
```json
{
  "success": true,
  "data": {
    "_id": "<historial_id>",
    "cajaInicial": 1000,
    "cajaFinal": 1500,
    "efectivoCalculado": 1500,
    "efectivoReal": 1495,
    "diferencia": -5,
    "ventasEfectivo": 500,
    "ventasTarjeta": 300,
    "totalVentas": 800,
    "totalIngresado": 800,
    "fechaApertura": "2023-01-01T08:00:00.000Z",
    "fechaCierre": "2023-01-01T20:00:00.000Z",
    "usuarioApertura": {
      "_id": "<user_id>",
      "nombre": "Nombre Trabajador"
    },
    "usuarioCierre": {
      "_id": "<user_id>",
      "nombre": "Nombre Trabajador"
    },
    "abierto": false,
    "observaciones": "Cierre normal de caja"
  }
}
```

### Crear Historial de Cierre (Apertura)

**Endpoint:** `POST /api/historial-cierre`

**Acceso:** Admin, Trabajador

**Descripción:** Crea un nuevo historial de cierre (apertura de caja)

**Body:**
```json
{
  "cajaInicial": 1000,
  "observaciones": "Apertura de caja"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Historial de cierre creado exitosamente",
  "data": {
    "_id": "<historial_id>",
    "cajaInicial": 1000,
    "usuarioApertura": {
      "_id": "<user_id>",
      "nombre": "Nombre Trabajador"
    },
    "fechaApertura": "2023-01-02T08:00:00.000Z",
    "abierto": true,
    "observaciones": "Apertura de caja"
  }
}
```

### Actualizar Historial de Cierre

**Endpoint:** `PUT /api/historial-cierre/:id`

**Acceso:** Admin

**Descripción:** Actualiza un historial de cierre

**Body:**
```json
{
  "cajaInicial": 1100,
  "observaciones": "Apertura de caja corregida"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Historial de cierre actualizado exitosamente",
  "data": {
    "_id": "<historial_id>",
    "cajaInicial": 1100,
    "usuarioApertura": {
      "_id": "<user_id>",
      "nombre": "Nombre Trabajador"
    },
    "fechaApertura": "2023-01-02T08:00:00.000Z",
    "abierto": true,
    "observaciones": "Apertura de caja corregida"
  }
}
```

### Cerrar Historial de Cierre

**Endpoint:** `PATCH /api/historial-cierre/:id/cerrar`

**Acceso:** Admin, Trabajador

**Descripción:** Cierra un historial de cierre (cierre de caja)

**Body:**
```json
{
  "cajaFinal": 1600,
  "efectivoReal": 1595,
  "observaciones": "Cierre de caja con pequeña diferencia"
}
```

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Historial de cierre cerrado exitosamente",
  "data": {
    "_id": "<historial_id>",
    "cajaInicial": 1100,
    "cajaFinal": 1600,
    "efectivoCalculado": 1600,
    "efectivoReal": 1595,
    "diferencia": -5,
    "ventasEfectivo": 500,
    "ventasTarjeta": 300,
    "totalVentas": 800,
    "totalIngresado": 800,
    "fechaApertura": "2023-01-02T08:00:00.000Z",
    "fechaCierre": "2023-01-02T20:00:00.000Z",
    "usuarioApertura": {
      "_id": "<user_id>",
      "nombre": "Nombre Trabajador"
    },
    "usuarioCierre": {
      "_id": "<user_id>",
      "nombre": "Nombre Trabajador"
    },
    "abierto": false,
    "observaciones": "Cierre de caja con pequeña diferencia"
  }
}
```

### Eliminar Historial de Cierre

**Endpoint:** `DELETE /api/historial-cierre/:id`

**Acceso:** Admin

**Descripción:** Elimina un historial de cierre

**Respuesta Exitosa:**
```json
{
  "success": true,
  "message": "Historial de cierre eliminado exitosamente"
}
```