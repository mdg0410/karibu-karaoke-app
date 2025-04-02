# Casos de Prueba del Frontend - Karibu Karaoke

Este documento detalla casos de prueba específicos para el frontend de la aplicación Karibu Karaoke.

## Pruebas de la Página Principal

### 1. Carga inicial y navegación

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F01 | Carga de la página principal | 1. Acceder a http://localhost:3000 | La página principal se carga con los tres portales |
| F02 | Verificar internacionalización | 1. Cambiar el idioma usando los botones EN/ES | El texto de la página cambia según el idioma seleccionado |
| F03 | Verificar elementos visuales | 1. Inspeccionar la página | El logo, títulos y botones se muestran correctamente |

### 2. Selección de portal

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F04 | Entrar como Cliente | 1. Hacer clic en "Entrar como Cliente" | Se crea un usuario, se muestra mensaje de éxito y se redirecciona al dashboard de cliente |
| F05 | Entrar como Admin | 1. Hacer clic en "Entrar como Admin" | Se crea un usuario, se muestra mensaje de éxito y se redirecciona al dashboard de admin |
| F06 | Entrar como Staff | 1. Hacer clic en "Entrar como Staff" | Se crea un usuario, se muestra mensaje de éxito y se redirecciona al dashboard de staff |

### 3. Componente Toast

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F07 | Mostrar mensaje de éxito | 1. Realizar una acción exitosa (crear usuario) | Se muestra un toast verde con mensaje de éxito |
| F08 | Mostrar mensaje de error | 1. Provocar un error (ej. apagar el servidor y tratar de entrar) | Se muestra un toast rojo con mensaje de error |
| F09 | Cerrar toast | 1. Hacer clic en el botón "X" del toast | El toast desaparece |
| F10 | Cierre automático de toast | 1. Esperar 5 segundos después de que aparezca un toast | El toast desaparece automáticamente |

## Pruebas del Dashboard de Cliente

### 1. Navegación por secciones

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F11 | Verificar sección Bebidas | 1. Entrar como Cliente<br>2. Hacer clic en "Bebidas" | Se muestra la sección de Bebidas |
| F12 | Verificar sección Comida | 1. Entrar como Cliente<br>2. Hacer clic en "Comida" | Se muestra la sección de Comida |
| F13 | Verificar sección Canciones | 1. Entrar como Cliente<br>2. Hacer clic en "Canciones" | Se muestra la sección de Canciones |
| F14 | Indicador de sección activa | 1. Entrar como Cliente<br>2. Hacer clic en cada sección | La sección activa se resalta con un borde en la parte inferior |

### 2. Funcionalidad del carrito

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F15 | Abrir carrito | 1. Entrar como Cliente<br>2. Hacer clic en el icono del carrito | El panel lateral del carrito se abre |
| F16 | Cerrar carrito | 1. Con el carrito abierto, hacer clic en X | El panel lateral se cierra |

### 3. Perfil y cierre de sesión

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F17 | Abrir menú de perfil | 1. Entrar como Cliente<br>2. Hacer clic en el nombre de usuario | Se abre el menú desplegable |
| F18 | Ver perfil | 1. Con el menú abierto, hacer clic en "Perfil" | Se muestra la sección de perfil con los datos del usuario |
| F19 | Cerrar sesión | 1. Con el menú abierto, hacer clic en "Cerrar sesión" | Se cierra la sesión y se redirecciona a la página principal |

## Pruebas del Dashboard de Admin

### 1. Navegación por secciones

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F20 | Verificar sección Mesas | 1. Entrar como Admin<br>2. Hacer clic en "Mesas" | Se muestra la sección de Mesas |
| F21 | Verificar sección Pedidos | 1. Entrar como Admin<br>2. Hacer clic en "Pedidos" | Se muestra la sección de Pedidos |
| F22 | Verificar sección Canciones | 1. Entrar como Admin<br>2. Hacer clic en "Canciones" | Se muestra la sección de Canciones |
| F23 | Verificar sección Inventario | 1. Entrar como Admin<br>2. Hacer clic en "Inventario" | Se muestra la sección de Inventario |
| F24 | Verificar sección Reportes | 1. Entrar como Admin<br>2. Hacer clic en "Reportes" | Se muestra la sección de Reportes |
| F25 | Indicador de sección activa | 1. Entrar como Admin<br>2. Hacer clic en cada sección | La sección activa se resalta con un borde en la parte inferior |

### 2. Perfil y cierre de sesión

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F26 | Abrir menú de perfil | 1. Entrar como Admin<br>2. Hacer clic en el nombre de usuario | Se abre el menú desplegable |
| F27 | Cerrar sesión | 1. Con el menú abierto, hacer clic en "Cerrar sesión" | Se cierra la sesión y se redirecciona a la página principal |

## Pruebas del Dashboard de Staff

### 1. Navegación por secciones

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F28 | Verificar sección Mesas | 1. Entrar como Staff<br>2. Hacer clic en "Mesas" | Se muestra la sección de Mesas |
| F29 | Verificar sección Pedidos | 1. Entrar como Staff<br>2. Hacer clic en "Pedidos" | Se muestra la sección de Pedidos |
| F30 | Verificar sección Canciones | 1. Entrar como Staff<br>2. Hacer clic en "Canciones" | Se muestra la sección de Canciones |
| F31 | Indicador de sección activa | 1. Entrar como Staff<br>2. Hacer clic en cada sección | La sección activa se resalta con un borde en la parte inferior |

### 2. Perfil y cierre de sesión

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F32 | Abrir menú de perfil | 1. Entrar como Staff<br>2. Hacer clic en el nombre de usuario | Se abre el menú desplegable |
| F33 | Cerrar sesión | 1. Con el menú abierto, hacer clic en "Cerrar sesión" | Se cierra la sesión y se redirecciona a la página principal |

## Pruebas de Responsive Design

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F34 | Vista móvil de la página principal | 1. Abrir la página principal en un dispositivo móvil o simulador | La página se adapta correctamente al tamaño de pantalla |
| F35 | Vista móvil del dashboard de Cliente | 1. Entrar como Cliente en un dispositivo móvil | El dashboard se adapta correctamente, posiblemente mostrando un menú hamburguesa |
| F36 | Vista móvil del dashboard de Admin | 1. Entrar como Admin en un dispositivo móvil | El dashboard se adapta correctamente, posiblemente mostrando un menú hamburguesa |
| F37 | Vista móvil del dashboard de Staff | 1. Entrar como Staff en un dispositivo móvil | El dashboard se adapta correctamente, posiblemente mostrando un menú hamburguesa |

## Pruebas de Persistencia

| ID | Descripción | Pasos | Resultado esperado |
|----|-------------|-------|-------------------|
| F38 | Persistencia de sesión | 1. Iniciar sesión como cualquier tipo de usuario<br>2. Recargar la página | El usuario permanece autenticado y en el mismo dashboard |
| F39 | Persistencia de idioma | 1. Cambiar el idioma<br>2. Recargar la página | El idioma seleccionado se mantiene |

## Resolución de problemas comunes

### Problema: Los estilos de TailwindCSS no se aplican correctamente

**Solución**: 
1. Verificar que el archivo `tailwind.config.js` incluye todas las rutas necesarias
2. Ejecutar `npx tailwindcss build -o public/styles.css` para regenerar los estilos
3. Verificar que las clases de Tailwind están escritas correctamente

### Problema: Los componentes no reciben las props correctamente

**Solución**:
1. Usar React Developer Tools para verificar las props que recibe cada componente
2. Revisar la consola en busca de advertencias o errores relacionados con props
3. Verificar que se están pasando todas las props requeridas

### Problema: Errores de conexión con el backend

**Solución**:
1. Verificar que el servidor backend está en ejecución
2. Comprobar que el proxy en `vite.config.js` está configurado correctamente
3. Revisar la consola del navegador para ver errores específicos de la API
