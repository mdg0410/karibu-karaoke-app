# Estructura de la Tabla de Productos en MongoDB

Este documento describe la estructura de la colección `products` en la base de datos MongoDB para el proyecto Karibu Karaoke.

## Estructura del Documento

```javascript
{
  "_id": ObjectId("..."), // ID único generado por MongoDB
  "nombre": "Combo 3 Cocteles", // Nombre del producto (string)
  "categoria": "Combo", // Categoría del producto (string)
  "precio": 10, // Precio del producto (number)
  "imagenURL": "Coctel.jpg", // URL o nombre de la imagen (string)
  "cantidad": 10, // Cantidad disponible en inventario (number)
  "estado": "disponible", // Estado del producto: "disponible", "agotado" u "oculto"
  "createdAt": ISODate("2023-04-01T20:00:00Z"), // Fecha de creación
  "updatedAt": ISODate("2023-04-01T20:00:00Z") // Fecha de última actualización
}
```

## Categorías de Productos

- `comida`: Productos que aparecerán en la sección "Comida" del dashboard de clientes
  - Nota: El filtrado es insensible a mayúsculas/minúsculas, así que funcionan: "comida", "Comida", "COMIDA", etc.
- Cualquier otra categoría (como `bebida`, `combo`, etc.) aparecerá en la sección "Bebidas" del dashboard de clientes

## Filtrado por Categoría en la API

La API filtra los productos según la categoría solicitada:

1. **Bebidas**: 
   - Endpoint: `/api/productos/categoria/bebidas`
   - Filtro: Retorna todos los productos cuya categoría NO coincida con "comida" (insensible a mayúsculas/minúsculas)
   - Ejemplo de categorías mostradas: "bebida", "combo", "postre", etc.

2. **Comida**:
   - Endpoint: `/api/productos/categoria/comida`
   - Filtro: Retorna productos cuya categoría coincida con "comida" (insensible a mayúsculas/minúsculas)

3. **Listado de Categorías**:
   - Endpoint: `/api/productos/categorias`
   - Devuelve una lista de todas las categorías únicas en la base de datos
   - Útil para diagnosticar problemas con las categorías

## Verificación de la Estructura

Si encuentra problemas con la visualización de productos, verifique:

1. Que la colección se llame exactamente `products` (plural, todo en minúscula)
2. Que los campos tengan exactamente los nombres especificados en el modelo
3. Que los tipos de datos sean correctos (especialmente precio como número)

## Solución de Problemas

Si los productos no se muestran correctamente:

1. **Problema**: No aparecen productos al consultar la API
   - **Verificación**: Consulte el endpoint `/api/productos/categorias` para ver las categorías existentes
   - **Solución**: Asegúrese de que sus productos tengan la categoría esperada ("comida" para sección de comida)

2. **Problema**: Bucle infinito con imágenes
   - **Verificación**: Revise el código de manejo de errores de imágenes
   - **Solución**: El código debería evitar intentar cargar la misma imagen default varias veces

3. **Problema**: API devuelve error 500
   - **Verificación**: Revise los logs del servidor para ver errores específicos
   - **Solución**: Verifique la conexión a la base de datos y la estructura de los documentos

4. **Problema**: Se muestran productos en categorías incorrectas
   - **Verificación**: Compruebe el campo `categoria` de los productos
   - **Solución**: Asegúrese de que los productos de comida tengan "comida" como categoría (puede variar en mayúsculas/minúsculas) 