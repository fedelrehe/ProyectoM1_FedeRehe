# Colorist - Generador de Paletas Editoriales

Colorist es una aplicación web interactiva diseñada para crear, explorar y gestionar paletas de colores con un enfoque minimalista y profesional. Desarrollado como Proyecto Integrador, esta herramienta permite agilizar el flujo de trabajo visual sin depender de librerías externas.

## Enlaces del Proyecto
---

* **Repositorio:** https://github.com/fedelrehe/ProyectoM1_FedeRehe.git
* **Sitio web:** https://fedelrehe.github.io/ProyectoM1_FedeRehe/
* **Demostración y Capturas (Google Drive):** [Carpeta de Demostración - Colorist](https://drive.google.com/drive/folders/1BHx0xbfF162iV8fDA4LL9wIrPkeiITlx) / [Carpeta de Capturas de IA - Colorist](https://drive.google.com/drive/folders/1wsqFrdqLFXrXFlJ0QAGyfCPT6iOPAX1D?usp=drive_link)

## 1. Estructura del Repositorio
---

El proyecto está modularizado para separar responsabilidades (interfaz, estilos y lógica) y facilitar la escalabilidad:

```text
├── index.html       # Vista principal: Interfaz del generador asimétrico.
├── explorar.html    # Vista secundaria: Dashboard de exploración y filtrado.
├── style.css        # Hoja de estilos global (Flexbox, Grid, variables CSS).
├── app.js           # Lógica core: algoritmos de color, eventos, conversiones y localStorage.
├── explorar.js      # Lógica de renderizado dinámico y filtrado de categorías.
└── README.md        # Documentación técnica y guía del proyecto.
```

## 2. Funcionalidades
---

* **Generador dinámico:** permite la creación aleatoria de paletas adaptables a `6`, `8` o `9` bloques de color.
* **Bloqueo inteligente (Lock):** consiste en un sistema individual de candados que permite fijar colores específicos mientras se re-generan los demás para refinar la paleta perfecta.
* **Conversión en tiempo real:** un interruptor interactivo transforma instantáneamente todos los valores en pantalla entre formatos `HEX` y `HSL` mediante algoritmos matemáticos en JS.
* **Dashboard de exploración:** dispone de una sección dedicada con una base de datos local de paletas predefinidas (ej. Primavera, Editorial, Retro), categorizadas y renderizadas dinámicamente. Al seleccionar una, se transfiere automáticamente al generador principal.
* **Historial persistente:** utiliza una ventana modal tipo *Glassmorphism* que almacena las últimas combinaciones generadas.
  * Permite "viajar en el tiempo" para recuperar iteraciones anteriores.
* **Copiado rápido:** al hacer clic directamente sobre la tarjeta del color deseado, se integra de forma nativa la copia de códigos de color al portapapeles, acompañado del mensaje `¡Copiado!` como confirmación.

## 3. Cómo usar la aplicación
---

* **Generar:** al ingresar, ajusta el selector para elegir la cantidad de colores (`6`, `8` o `9`) y presiona "Generar paleta".
* **Fijar y refinar:** si un color te gusta, haz clic en el ícono de candado para bloquearlo. Al volver a generar, ese color se mantendrá intacto.
* **Cambiar formato:** utiliza el interruptor deslizable junto al botón principal para alternar la visualización y copiado entre `HEX` y `HSL`.
* **Copiar:** haz clic directamente sobre la tarjeta del color deseado para copiar su código al portapapeles. Un aviso temporal confirmará la acción con la etiqueta `¡Copiado!`.
* **Explorar:** navega a la pestaña "Explorar" en el menú superior para ver opciones prediseñadas. Filtra por estilo o estación en el menú lateral y haz clic en cualquier paleta para cargarla en tu espacio de trabajo.
* **Recuperar:** abre "Historial" en la navegación para acceder a tus paletas anteriores y reactivarlas con un clic.

## 4. Decisiones técnicas tomadas
---

* **Arquitectura Frontend (Vanilla JavaScript):** se optó deliberadamente por Vanilla JavaScript (ES6+) en lugar de frameworks como React o Vue. Esto permitió afianzar el manejo nativo del DOM, la delegación de eventos y la modularidad del código.
* **Manipulación dinámica del DOM y optimización:** la interfaz se construye de forma dinámica mediante `document.createElement` e interpolación de plantillas. Para la funcionalidad de bloqueo, el algoritmo lee el estado actual del DOM antes de limpiar el contenedor, reduciendo los ciclos de reflow y repaint.
* **Modelado y algoritmos de conversión de color:** la conversión bidireccional entre los espacios de color `HEX` y `HSL` se procesa íntegramente en el cliente mediante funciones algorítmicas puras y expresiones regulares (`Regex`).
* **Gestión de estado mediante Web Storage API:** se implementó una simulación de persistencia de datos utilizando `localStorage`.
  * Serialización de datos mediante `JSON.stringify` y `JSON.parse`.
  * Optimización de memoria limitando a las últimas `20` iteraciones mediante una estructura FIFO.
  * Comunicación cross-document para pasar datos entre `explorar.html` e `index.html`.
* **Estructuración CSS avanzada y layout:** el diseño visual se construyó priorizando una estética editorial y minimalista.
  * Layout híbrido utilizando Flexbox y CSS Grid.
  * Custom Properties (Variables CSS) en el bloque `:root`.
  * Micro-interacciones y UI con técnicas de Glassmorphism aplicando `backdrop-filter`.

## 5. Documentación del uso de IA
---

* **Lógica algorítmica y modelado matemático:** se estructuraron prompts detallados para asistir en la formulación de algoritmos matemáticos necesarios para transicionar bidireccionalmente entre `HEX` y `HSL`.
* **Pair programming y refactorización:** se realizó la auditoría y optimización de fragmentos de código, sustituyendo concatenaciones por Template Literals y estructuración modular de funciones.
* **Troubleshooting y diagnóstico de bugs:** actuó como diagnóstico en tiempo real ante comportamientos inesperados, como la resolución de conflictos de especificidad CSS al ocultar el `input type="checkbox"`.
* **Consultoría de UI/UX y estética editorial:** brindó asistencia teórica para implementar un layout asimétrico de pantalla dividida (Split Screen) y generación conjunta de paletas temáticas con criterio comercial (ej. paleta "Brote Editorial").

