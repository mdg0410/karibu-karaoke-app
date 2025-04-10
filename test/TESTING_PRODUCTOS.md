# Guía de Pruebas para la API de Productos

Esta guía describe cómo probar la API de Productos para Karibu Karaoke usando Postman.

## Configuración Inicial

1. Importa la colección de Postman:
   - Abre Postman
   - Haz clic en "Import" > "File" > Selecciona el archivo `productos_postman_collection.json`

2. Configura las variables de entorno:
   - Crea un nuevo entorno en Postman (icono de engranaje > "Add")
   - Configura las siguientes variables:
     - `baseUrl`: `https://localhost:5000` (o la URL de tu servidor)
     - `adminToken`: Un token JWT válido para un usuario con rol de administrador
     - `productoId`: Se rellenará automáticamente después de crear un producto

## Pasos para Probar la API

### 1. Obtener un Token de Administrador

Si no tienes un token de administrador:

1. Usa la ruta de inicio de sesión para administradores (`/api/auth/admin/login`)
2. Guarda el token recibido como valor para la variable `adminToken`

### 2. Crear Productos de Prueba

1. Selecciona la solicitud "Crear producto" en la colección
2. El cuerpo ya contiene un producto de ejemplo:
   ```json
   {
     "nombre": "Combo 3 Cocteles",
     "categoria": "Combo",
     "precio": 10,
     "imagenURL": "Coctel.jpg",
     "cantidad": 10,
     "estado": "disponible"
   }
   ```
3. Ejecuta la solicitud
4. Si la solicitud es exitosa, recibirás un status 201 y el producto creado
5. Copia el `_id` del producto creado y guárdalo como valor de la variable `productoId`

4. Crea al menos estos productos adicionales (con diferentes categorías):
   - Un producto de categoría "comida"
   - Un producto de categoría "bebida"
   - Un producto de otra categoría (ej. "postre")

### 3. Probar Endpoints Públicos

#### Obtener Todos los Productos
1. Selecciona la solicitud "Obtener todos los productos"
2. Ejecuta la solicitud
3. Verifica que recibes status 200 y una lista de productos

#### Obtener Bebidas
1. Selecciona la solicitud "Obtener bebidas"
2. Ejecuta la solicitud
3. Verifica que recibes status 200 y una lista de productos
4. Confirma que los productos devueltos NO son de categoría "comida"

#### Obtener Comida
1. Selecciona la solicitud "Obtener comida"
2. Ejecuta la solicitud
3. Verifica que recibes status 200 y una lista de productos
4. Confirma que los productos devueltos son SOLO de categoría "comida"

#### Obtener Producto por ID
1. Selecciona la solicitud "Obtener producto por ID"
2. Ejecuta la solicitud (asegúrate de que la variable `productoId` esté configurada)
3. Verifica que recibes status 200 y los detalles del producto

### 4. Probar Endpoints Protegidos (solo admin)

#### Actualizar Producto
1. Selecciona la solicitud "Actualizar producto"
2. El cuerpo ya contiene una actualización de ejemplo:
   ```json
   {
     "nombre": "Combo 3 Cocteles Actualizado",
     "precio": 12.50,
     "cantidad": 8
   }
   ```
3. Ejecuta la solicitud
4. Verifica que recibes status 200 y el producto actualizado

#### Cambiar Estado del Producto
1. Selecciona la solicitud "Cambiar estado producto"
2. El cuerpo ya contiene un cambio de estado de ejemplo:
   ```json
   {
     "estado": "agotado"
   }
   ```
3. Ejecuta la solicitud
4. Verifica que recibes status 200 y el producto con estado actualizado

#### Eliminar Producto
1. Selecciona la solicitud "Eliminar producto"
2. Ejecuta la solicitud
3. Verifica que recibes status 200 y un mensaje de éxito
4. Intenta obtener el producto eliminado para confirmar que ya no existe (debería recibir un 404)

## Validación del Frontend

Una vez que la API esté funcionando correctamente, verifica que el frontend muestra los productos correctamente:

1. Inicia la aplicación frontend
2. Accede al dashboard de cliente e inicia sesión
3. Navega a la sección "Bebidas" y verifica que:
   - Se muestran los productos que NO son de categoría "comida"
   - Los productos agotados aparecen como no disponibles
4. Navega a la sección "Comida" y verifica que:
   - Solo se muestran los productos de categoría "comida"
   - Los productos agotados aparecen como no disponibles

## Solución de Problemas

Si encuentras problemas durante las pruebas, verifica:

1. Que el servidor backend esté funcionando correctamente
2. Que el token de administrador sea válido y no haya expirado
3. Que estés usando un ID de producto válido para las pruebas individuales
4. Que la base de datos esté funcionando correctamente 