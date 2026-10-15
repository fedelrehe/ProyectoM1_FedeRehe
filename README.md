# Colorist 🎨 - Generador de Paletas Editoriales

Colorist es una aplicación web interactiva diseñada para crear, explorar y gestionar paletas de colores con un enfoque minimalista y profesional. Desarrollado como Proyecto Integrador, esta herramienta permite agilizar el flujo de trabajo visual sin depender de librerías externas.

Repositorio: [text] https://fedelrehe.github.io/ProyectoM1_FedeRehe/
Sitio web publicado en GitHub Pages: [text] https://fedelrehe.github.io/ProyectoM1_FedeRehe/

---

## 1. Estructura del Repositorio 📂

El proyecto está modularizado para separar responsabilidades (interfaz, estilos y lógica) y facilitar la escalabilidad:

```ProyectoM1_FedeRehe
├── index.html       # Vista principal: Interfaz del generador asimétrico.
├── explorar.html    # Vista secundaria: Dashboard de exploración y filtrado.
├── style.css        # Hoja de estilos global (Flexbox, Grid, variables CSS).
├── app.js           # Lógica core: algoritmos de color, eventos, conversiones y localStorage.
├── explorar.js      # Lógica de renderizado dinámico y filtrado de categorías.
└── README.md        # Documentación técnica y guía del proyecto.

## 2. Funcionalidades Detalladas ✨

* **Generador Dinámico:** Creación aleatoria de paletas adaptables a 6, 8 o 9 bloques de color.
* **Bloqueo Inteligente (Lock):** Sistema individual de candados que permite fijar colores específicos mientras se re-generan los demás para refinar la paleta perfecta.
* **Conversión en Tiempo Real:** Toggle interactivo que transforma instantáneamente todos los valores en pantalla entre formatos `HEX` y `HSL` mediante algoritmos matemáticos en JS.
* **Dashboard "Explorar":** Una sección dedicada con una base de datos local de paletas predefinidas (ej. Primavera, Editorial, Retro), categorizadas y renderizadas dinámicamente. Al seleccionar una, se transfiere automáticamente al generador principal.
* **Historial Persistente:** Ventana modal tipo *Glassmorphism* que almacena las últimas combinaciones generadas, permitiendo "viajar en el tiempo" para recuperar iteraciones anteriores.
* **Copiado Rápido (Clipboard API):** Integración nativa para copiar códigos de color al portapapeles con un solo clic, acompañado de microfeedback visual (Toast notification).

## 3. Cómo usar la aplicación 📖

1. **Generar:** Al ingresar, ajusta el selector para elegir la cantidad de colores (6, 8 o 9) y presiona "Generar paleta".
2. **Fijar y Refinar:** Si un color te gusta, haz clic en el ícono de candado (🔓 a 🔒). Al volver a generar, ese color se mantendrá intacto.
3. **Cambiar Formato:** Utiliza el interruptor deslizable junto al botón principal para alternar la visualización y copiado entre HEX y HSL.
4. **Copiar:** Haz clic directamente sobre la tarjeta del color deseado para copiar su código al portapapeles. Un aviso temporal confirmará la acción.
5. **Explorar:** Navega a la pestaña "Explorar" en el menú superior para ver opciones prediseñadas. Filtra por estilo o estación en el menú lateral y haz clic en cualquier paleta para cargarla en tu espacio de trabajo.
6. **Recuperar:** Abre "Historial" en la navegación para acceder a tus paletas anteriores y reactivarlas con un clic.

Demostración de las funcionalidades de la página detalladas en GIF aquí: [text](https://drive.google.com/drive/folders/1BHx0xbfF162iV8fDA4LL9wIrPkeiITlx?usp=drive_link)

## 4. Decisiones Técnicas Tomadas 🛠️

Para el desarrollo de Colorist, se priorizó la creación de una arquitectura ligera y escalable, enfocándose fuertemente en las bases del desarrollo web moderno sin depender de bibliotecas de terceros.

### 4.1. Arquitectura Frontend (Vanilla JavaScript)
Se optó deliberadamente por **Vanilla JavaScript** (ES6+) en lugar de frameworks como React o Vue. Esto permitió afianzar el manejo nativo del DOM, la delegación de eventos y la modularidad del código, separando la lógica de la aplicación principal (`app.js`) de la lógica de renderizado secundario (`explorar.js`).

### 4.2. Manipulación Dinámica del DOM y Optimización
En lugar de codificar estructuras estáticas en HTML, la interfaz se construye de forma dinámica mediante `document.createElement` e interpolación de plantillas (Template Literals). 
* **Preservación de Estado Visual:** Para la funcionalidad de "Bloqueo" (Lock), el algoritmo lee el estado actual del DOM (verificando la presencia de la clase `.locked` mediante `querySelectorAll`) antes de limpiar el contenedor. Esto permite aislar y re-inyectar los colores bloqueados sin necesidad de gestionar estados complejos de Reactividad, reduciendo los ciclos de *reflow* y *repaint* del navegador.

### 4.3. Modelado y Algoritmos de Conversión de Color
Se implementó un modelado matemático propio para el tratamiento de los sistemas de color. 
* En lugar de depender de APIs externas, la conversión bidireccional entre los espacios de color **HEX** y **HSL** se procesa íntegramente en el cliente (Client-side) mediante funciones algorítmicas puras. 
* Se utilizaron Expresiones Regulares (`Regex`) para parsear los strings de color dinámicamente y aplicar fórmulas de interpolación de tono, saturación y luminosidad (Hue, Saturation, Lightness), permitiendo que el toggle de formato actualice la interfaz en tiempo real y con latencia cero.

### 4.4. Gestión de Estado mediante Web Storage API
Se implementó una simulación de persistencia de datos (Backendless) utilizando `localStorage`.
* **Serialización de Datos:** Los arrays de paletas se transforman mediante `JSON.stringify` y `JSON.parse` para su almacenamiento y lectura.
* **Optimización de Memoria (Estructura FIFO):** El historial de paletas funciona bajo un modelo FIFO (First In, First Out). Mediante los métodos `unshift()` y `pop()`, se limitó el almacenamiento estricto a las últimas 20 iteraciones, previniendo fugas de memoria o saturación del límite de cuota del navegador.
* **Comunicación Cross-Document:** El `localStorage` se utilizó estratégicamente como puente de datos para comunicar documentos independientes. Al seleccionar un ítem en `explorar.html`, este se guarda en la memoria local y se inyecta inmediatamente al redireccionar a `index.html`.

### 4.5. Estructuración CSS Avanzada y Layout
El diseño visual se construyó priorizando una estética editorial y minimalista, estructurada con técnicas CSS3 modernas:
* **Layout Híbrido (Flexbox y CSS Grid):** Se empleó un enfoque de pantalla dividida (*Split Screen Asimétrico*) en la vista principal utilizando **CSS Flexbox** para alinear controles y barras de color. Para el dashboard de exploración, se implementó **CSS Grid** (`grid-template-columns: repeat(auto-fill, minmax())`), garantizando un diseño fluido y completamente responsivo sin necesidad de múltiples *Media Queries*.
* **Custom Properties (Variables CSS):** Se definió un sistema de diseño centralizado en el bloque `:root` para colores globales, tipografías y radios de borde, facilitando la escalabilidad y el mantenimiento del tema.
* **Micro-interacciones y UI:** Se implementaron técnicas de *Glassmorphism* (`backdrop-filter`) para la ventana modal y se aplicaron manipulaciones de *z-index* y *opacity* combinadas con posicionamiento absoluto para reemplazar los *checkboxes* nativos del navegador por interruptores deslizables (*toggles*) totalmente personalizados.

## 5. Documentación del uso de IA 🤖

Durante todo el ciclo de vida del desarrollo de **Colorist**, se integró el modelo de lenguaje de Inteligencia Artificial (Gemini) operando bajo un esquema de **Pair Programming** (programación en pareja) y consultoría técnica. 

Lejos de delegar la creación del proyecto, la IA fue instrumentada como un copiloto estratégico para acelerar la iteración, diagnosticar errores y elevar los estándares de calidad tanto en el código como en el diseño de interfaces. El uso de esta tecnología se desglosó en las siguientes áreas clave:

### 5.1. Lógica Algorítmica y Modelado Matemático
Uno de los mayores desafíos técnicos del proyecto fue la conversión en tiempo real de espacios de color sin depender de librerías de terceros. 
* Se estructuraron *prompts* detallados para que la IA asistiera en la formulación de los algoritmos matemáticos necesarios para transicionar bidireccionalmente entre **HEX y HSL**. 
* La IA facilitó la lógica de parseo de strings (mediante Expresiones Regulares) y la aplicación de fórmulas de interpolación de tono y saturación, garantizando que los datos devueltos al DOM fueran matemáticamente precisos.

### 5.2. Pair Programming y Refactorización
A lo largo de la escritura del código en JavaScript (Vanilla), se utilizó la IA para auditar y optimizar fragmentos de código, asegurando la aplicación de buenas prácticas de ES6+:
* Sustitución de concatenaciones tradicionales por **Template Literals** para una inyección del DOM más limpia y legible.
* Optimización de ciclos iterativos (uso de `forEach` sobre arreglos de datos).
* Estructuración modular de las funciones (ej. aislar la función `copyToClipboard` de la lógica de generación) para respetar el principio de responsabilidad única (Single Responsibility Principle).

### 5.3. Troubleshooting y Diagnóstico de Bugs (Debugging)
La IA funcionó como una herramienta de diagnóstico en tiempo real ante comportamientos inesperados del navegador:
* **Resolución de conflictos CSS:** Se analizó un problema de especificidad (CSS Specificity) donde los estilos nativos del navegador sobrescribían el diseño personalizado de los interruptores (toggles). La IA guio el proceso de forzar el ocultamiento del `<input type="checkbox">` mediante posicionamiento absoluto e inyección de pseudo-elementos (`::before`), logrando la estética deslizable deseada.
* **Trazabilidad de Errores de Sintaxis:** Asistencia en la revisión de bloques de código CSS y JS para detectar llaves de cierre faltantes que bloqueaban la ejecución del renderizado de la interfaz.

### 5.4. Consultoría de UI/UX y Estética Editorial
Aprovechando el enfoque en el diseño de interfaces limpias, se utilizó la IA como un *sparring* creativo para definir la dirección de arte de la aplicación:
* **Estructuración de Layouts:** Asistencia teórica para implementar un layout asimétrico de pantalla dividida (*Split Screen*), justificando cómo este patrón de diseño mejora la jerarquía visual de la herramienta.
* **Curaduría de Color (Color Theory):** Generación conjunta de paletas temáticas con criterio comercial y editorial para el *Dashboard* de exploración. Un ejemplo destacado es la formulación de la paleta "Brote Editorial" para la categoría Primavera, donde se estructuró un equilibrio entre tonos lino, verde salvia y acentos marinos, eludiendo combinaciones saturadas estándar.

Adjunto evidencias visuales en este archivo: [text](https://drive.google.com/drive/folders/1wsqFrdqLFXrXFlJ0QAGyfCPT6iOPAX1D?usp=drive_link)