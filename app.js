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
    // 1. Averiguamos cuántos colores quiere el usuario
    const size = parseInt(paletteSizeSelect.value);
    
    // 2. Limpiamos el contenedor antes de inyectar una paleta nueva
    paletteContainer.innerHTML = '';
    
    // RETO PARA TI:
    // Crea un bucle 'for' que se ejecute 'size' cantidad de veces.
    for (let i = 0; i < size; i++) {
        // A. Generamos el código hexadecimal usando la función que ya creaste
        const randomColor = getRandomHexColor();
        
        // B. Creamos un nuevo elemento <div> para la tarjeta
        const colorCard = document.createElement('div');
        colorCard.classList.add('color-card');
        
        // C. Le inyectamos el HTML interno a la tarjeta, 
        // aplicando el color de fondo y mostrando el texto
        colorCard.innerHTML = `
            <div class="color-display" style="background-color: ${randomColor};"></div>
            <div class="color-info">${randomColor}</div>
        `;
        // Le agregamos un evento de clic a toda la tarjeta
        colorCard.addEventListener('click', () => {
            copyToClipboard(randomColor);
        });
        // D. Agregamos la tarjeta recién creada al contenedor principal
        paletteContainer.appendChild(colorCard);
    }
});