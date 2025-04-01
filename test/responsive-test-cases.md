# Casos de Prueba para Diseño Responsivo - Karibu Karaoke

Este documento detalla los casos de prueba específicos para verificar el diseño responsivo de la aplicación Karibu Karaoke en diferentes dispositivos.

## Dispositivos de Prueba Recomendados

### Móviles
- iPhone SE (375px)
- iPhone X/11/12/13 (390px)
- Google Pixel (393px)
- Samsung Galaxy S10/S20 (360px)

### Tablets
- iPad Mini (768px)
- iPad/iPad Air (820px)
- iPad Pro (1024px)

### Escritorio
- Laptop (1366px)
- Desktop (1920px)

## Pruebas de la Página Principal

| ID | Descripción | Dispositivo | Pasos | Resultado Esperado |
|----|-------------|-------------|-------|-------------------|
| R01 | Vista móvil del navbar | Móvil | 1. Abrir la aplicación en un dispositivo móvil<br>2. Observar el navbar | - El logo se muestra<br>- Se muestra un botón de menú hamburguesa<br>- El menú está oculto |
| R02 | Funcionalidad del menú hamburguesa | Móvil | 1. Hacer clic en el botón de menú | - El menú se despliega<br>- Se muestran el selector de idiomas y el botón "Comenzar" |
| R03 | Grid de opciones en móvil | Móvil | 1. Observar el grid de opciones | - Las tarjetas se muestran en una columna<br>- Los botones ocupan el ancho completo de la tarjeta |
| R04 | Grid de opciones en tablet | Tablet | 1. Observar el grid de opciones | - Las tarjetas se muestran en 2 columnas<br>- Los botones tienen un ancho apropiado |
| R05 | Grid de opciones en escritorio | Escritorio | 1. Observar el grid de opciones | - Las tarjetas se muestran en 3 columnas<br>- La distribución es equilibrada |

## Pruebas del Dashboard de Cliente

| ID | Descripción | Dispositivo | Pasos | Resultado Esperado |
|----|-------------|-------------|-------|-------------------|
| R06 | Vista móvil del navbar | Móvil | 1. Entrar como Cliente<br>2. Observar el navbar | - Se muestra el logo<br>- Se muestra el botón de menú hamburguesa<br>- Se muestra el icono del carrito<br>- Se muestra el avatar del usuario sin nombre |
| R07 | Funcionalidad del menú hamburguesa | Móvil | 1. Hacer clic en el botón de menú | - El menú se despliega<br>- Se muestran las secciones (Bebidas, Comida, Canciones, Perfil) |
| R08 | Cambio de secciones | Móvil | 1. Hacer clic en cada sección desde el menú móvil | - El contenido cambia según la sección<br>- El menú se cierra automáticamente |
| R09 | Carrito en móvil | Móvil | 1. Hacer clic en el icono del carrito | - El carrito ocupa la mayor parte de la pantalla<br>- Hay un overlay oscuro detrás<br>- Se puede cerrar haciendo clic en la X o en el overlay |
| R10 | Vista tablet del dashboard | Tablet | 1. Entrar como Cliente en una tablet | - El navbar muestra las secciones horizontalmente<br>- El nombre del usuario es visible<br>- No hay botón de menú hamburguesa |

## Pruebas del Dashboard de Admin

| ID | Descripción | Dispositivo | Pasos | Resultado Esperado |
|----|-------------|-------------|-------|-------------------|
| R11 | Vista móvil del navbar | Móvil | 1. Entrar como Admin<br>2. Observar el navbar | - Se muestra el logo<br>- Se muestra el botón de menú hamburguesa<br>- Se muestra el avatar del admin sin nombre |
| R12 | Funcionalidad del menú hamburguesa | Móvil | 1. Hacer clic en el botón de menú | - El menú se despliega<br>- Se muestran todas las secciones (Mesas, Pedidos, Canciones, Inventario, Reportes) |
| R13 | Vista tablet del navbar | Tablet | 1. Entrar como Admin en una tablet | - El menú sigue colapsado en una tablet pequeña<br>- El menú se muestra horizontalmente en tablets grandes |
| R14 | Vista desktop del navbar | Escritorio | 1. Entrar como Admin en un escritorio | - Todas las secciones se muestran horizontalmente<br>- No hay botón de menú hamburguesa |

## Pruebas del Dashboard de Staff

| ID | Descripción | Dispositivo | Pasos | Resultado Esperado |
|----|-------------|-------------|-------|-------------------|
| R15 | Vista móvil del navbar | Móvil | 1. Entrar como Staff<br>2. Observar el navbar | - Se muestra el logo<br>- Se muestra el botón de menú hamburguesa<br>- Se muestra el avatar del staff sin nombre |
| R16 | Funcionalidad del menú hamburguesa | Móvil | 1. Hacer clic en el botón de menú | - El menú se despliega<br>- Se muestran las secciones (Mesas, Pedidos, Canciones) |
| R17 | Vista tablet del navbar | Tablet | 1. Entrar como Staff en una tablet | - El menú se muestra horizontalmente<br>- El nombre del usuario es visible<br>- No hay botón de menú hamburguesa |

## Pruebas de Componentes Específicos

| ID | Descripción | Dispositivo | Pasos | Resultado Esperado |
|----|-------------|-------------|-------|-------------------|
| R18 | Notificaciones (Toast) | Móvil | 1. Realizar una acción que muestre una notificación<br>2. Observar el toast | - El toast se muestra en la parte inferior<br>- El mensaje es legible<br>- El botón de cerrar es fácil de hacer clic |
| R19 | Notificaciones (Toast) | Escritorio | 1. Realizar una acción que muestre una notificación | - El toast se muestra en la esquina inferior derecha<br>- El mensaje es legible |
| R20 | Menús desplegables de perfil | Móvil | 1. Hacer clic en el avatar del usuario | - El menú se despliega correctamente<br>- Los elementos son fáciles de hacer clic |

## Pruebas de Orientación

| ID | Descripción | Dispositivo | Pasos | Resultado Esperado |
|----|-------------|-------------|-------|-------------------|
| R21 | Cambio de orientación | Móvil | 1. Rotar el dispositivo de vertical a horizontal | - La interfaz se adapta al nuevo ancho<br>- No hay elementos cortados<br>- La experiencia de usuario se mantiene consistente |
| R22 | Cambio de orientación | Tablet | 1. Rotar el dispositivo de vertical a horizontal | - La interfaz se adapta al nuevo ancho<br>- Puede haber cambios en la disposición (ej. de 2 a 3 columnas) |

## Pruebas de Accesibilidad Móvil

| ID | Descripción | Dispositivo | Pasos | Resultado Esperado |
|----|-------------|-------------|-------|-------------------|
| R23 | Tamaño de toque | Móvil | 1. Intentar hacer clic en todos los botones y controles | - Todos los elementos interactivos tienen un área de toque suficiente (mínimo 44x44px)<br>- No hay problemas para hacer clic en elementos pequeños |
| R24 | Distancia entre elementos táctiles | Móvil | 1. Observar la separación entre elementos interactivos | - Hay suficiente espacio entre elementos para evitar clics accidentales |
| R25 | Scrolling | Móvil | 1. Hacer scroll en diferentes secciones | - El scrolling es suave<br>- No hay problemas de rendimiento<br>- El contenido no salta |

## Herramientas recomendadas para pruebas responsivas

1. **DevTools de navegadores**:
   - Chrome/Edge: Modo de dispositivo
   - Firefox: Diseño responsivo
   - Safari: Modo responsivo

2. **Dispositivos reales**:
   - Es recomendable probar en dispositivos físicos reales, especialmente para verificar el rendimiento

3. **Servicios en línea**:
   - BrowserStack
   - ResponsivelyApp
   - Sizzy

4. **Extensiones de navegador**:
   - Window Resizer
   - Responsive Viewer
