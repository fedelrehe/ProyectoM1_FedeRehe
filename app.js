const generateBtn = document.getElementById('generate-btn');
const paletteSizeSelect = document.getElementById('palette-size');
const paletteContainer = document.getElementById('palette-container');
const toast = document.getElementById('toast');

function getRandomHexColor() {
    const characters = '0123456789ABCDEF';
    let hex = '#';
    
    for (let i = 0; i < 6; i++) {
        const indiceAleatorio = Math.floor(Math.random() * characters.length);
        hex += characters[indiceAleatorio];
    }
    
    return hex;
}

// Función para copiar al portapapeles y mostrar el Toast
function copyToClipboard(hexCode) {
    // 1. Usamos la API moderna del navegador para copiar el texto
    navigator.clipboard.writeText(hexCode)
        .then(() => {
            // 2. Si se copió con éxito, configuramos el mensaje del Toast
            toast.textContent = `¡Color ${hexCode} copiado!`;
            
            // 3. Le quitamos la clase 'hidden' para que aparezca en pantalla
            toast.classList.remove('hidden');
            
            // 4. Configuramos un temporizador para ocultarlo después de 2.5 segundos
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 2500);
        })
        .catch(err => {
            console.error('No se pudo copiar el texto: ', err);
        });
}

generateBtn.addEventListener('click', () => {
    const size = parseInt(paletteSizeSelect.value);
    paletteContainer.innerHTML = '';
    
    // 1. Creamos un arreglo vacío para recopilar los colores de esta paleta
    const currentPalette = [];
    
    for (let i = 0; i < size; i++) {
        const randomColor = getRandomHexColor();
        
        // 2. Agregamos el color generado a nuestro arreglo
        currentPalette.push(randomColor);
        
        const colorCard = document.createElement('div');
        colorCard.classList.add('color-card');
        
        colorCard.innerHTML = `
            <div class="color-display" style="background-color: ${randomColor};"></div>
            <div class="color-info">${randomColor}</div>
        `;
        
        colorCard.addEventListener('click', () => {
            copyToClipboard(randomColor);
        });
        
        paletteContainer.appendChild(colorCard);
    }
    
    // 3. Convertimos el arreglo a texto (JSON) y lo guardamos en el navegador
    localStorage.setItem('colorist_palette', JSON.stringify(currentPalette));
});

// Función que inicializa la app leyendo el localStorage
function initApp() {
    // 1. Buscamos si hay datos guardados con la llave 'colorist_palette'
    const savedData = localStorage.getItem('colorist_palette');
    
    if (savedData) {
        // 2. Si hay datos, los transformamos de texto JSON a un arreglo de JS
        const savedPalette = JSON.parse(savedData);
        
        // 3. Ajustamos el <select> para que muestre la cantidad correcta (6, 8 o 9)
        paletteSizeSelect.value = savedPalette.length;
        
        // 4. Dibujamos las tarjetas iterando sobre el arreglo guardado
        paletteContainer.innerHTML = '';
        savedPalette.forEach(color => {
            const colorCard = document.createElement('div');
            colorCard.classList.add('color-card');
            
            colorCard.innerHTML = `
                <div class="color-display" style="background-color: ${color};"></div>
                <div class="color-info">${color}</div>
            `;
            
            colorCard.addEventListener('click', () => {
                copyToClipboard(color);
            });
            
            paletteContainer.appendChild(colorCard);
        });
    } else {
        // 5. Si no hay nada guardado (es la primera visita), simulamos un clic para generar una
        generateBtn.click();
    }
}

// Ejecutamos la función apenas carga el script
initApp();