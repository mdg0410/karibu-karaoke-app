# Karibu Karaoke App - Backend

## Descripción
Karibu Karaoke App es una aplicación de karaoke que permite a los usuarios registrarse, solicitar canciones y realizar pedidos en un entorno interactivo. Este backend está construido utilizando Node.js y Express, y se conecta a una base de datos MongoDB para almacenar la información de usuarios, productos, pedidos y solicitudes de canciones.

## Estructura del Proyecto
```
karibu-karaoke-app
├── backend
│   ├── src
│   │   └── server.js        # Punto de entrada del servidor
│   ├── package.json         # Configuración de npm
│   └── README.md            # Documentación del backend
└── frontend
    ├── public
    │   └── index.html       # Plantilla HTML principal
    ├── src
    │   ├── App.jsx          # Componente principal de React
    │   └── index.jsx        # Punto de entrada de la aplicación React
    ├── package.json         # Configuración de npm para el frontend
    └── README.md            # Documentación del frontend
```

## Instalación

1. Clona el repositorio:
   ```
   git clone https://github.com/tu_usuario/karibu-karaoke-app.git
   ```

2. Navega al directorio del backend:
   ```
   cd karibu-karaoke-app/backend
   ```

3. Instala las dependencias:
   ```
   npm install
   ```

4. Configura las variables de entorno necesarias para la conexión a MongoDB.

## Uso

1. Inicia el servidor:
   ```
   npm start
   ```

2. El servidor estará corriendo en `http://localhost:5000` (puedes cambiar el puerto en la configuración).

## Endpoints

- `POST /api/auth/register`: Registra un nuevo usuario.
- `GET /api/products`: Obtiene la lista de productos disponibles.
- `POST /api/songs`: Envía una solicitud de canción.
- `POST /api/orders`: Crea un nuevo pedido.

## Contribuciones
Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia
Este proyecto está bajo la Licencia MIT.