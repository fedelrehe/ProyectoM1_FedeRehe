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

function copyToClipboard(hexCode) {
    
    navigator.clipboard.writeText(hexCode)
        .then(() => {
            
            toast.textContent = `¡Color ${hexCode} copiado!`;
            
            toast.classList.remove('hidden');
            
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
    
    // 1. ANTES de borrar, capturamos las tarjetas que ya están en pantalla
    const existingCards = paletteContainer.querySelectorAll('.color-card');
    
    paletteContainer.innerHTML = '';
    const currentPalette = [];
    
    for (let i = 0; i < size; i++) {
        let randomColor;
        let isLocked = false;
        
        // 2. Revisamos si la tarjeta en la posición 'i' existe y está bloqueada
        if (existingCards[i] && existingCards[i].classList.contains('locked')) {
            // Si está bloqueada, "robamos" el color que ya tenía
            randomColor = existingCards[i].querySelector('.color-info').textContent;
            isLocked = true;
        } else {
            // Si no está bloqueada, generamos uno nuevo
            randomColor = getRandomHexColor();
        }
        
        currentPalette.push(randomColor);
        
        const colorCard = document.createElement('div');
        colorCard.classList.add('color-card');
        
        // Si estaba bloqueada, le devolvemos la clase para que se vea el candado cerrado
        if (isLocked) {
            colorCard.classList.add('locked');
        }
        
        // 3. Agregamos el HTML, incluyendo el botón del candado
        colorCard.innerHTML = `
            <div class="color-display" style="background-color: ${randomColor};"></div>
            <button class="lock-btn">${isLocked ? '🔒' : '🔓'}</button>
            <div class="color-info">${randomColor}</div>
        `;
        
        // 4. Funcionalidad del candado
        const lockBtn = colorCard.querySelector('.lock-btn');
        lockBtn.addEventListener('click', (evento) => {
            // IMPORTANTE: Evitamos que el clic en el candado active el copiado del color
            evento.stopPropagation(); 
            
            // Alternamos la clase 'locked' en la tarjeta principal
            colorCard.classList.toggle('locked');
            // Cambiamos el icono según el estado
            lockBtn.textContent = colorCard.classList.contains('locked') ? '🔒' : '🔓';
        });
        
        // 5. El copiado de color sigue funcionando al hacer clic en el resto de la tarjeta
        colorCard.addEventListener('click', () => {
            copyToClipboard(randomColor);
        });
        
        paletteContainer.appendChild(colorCard);
    }
    
    localStorage.setItem('colorist_palette', JSON.stringify(currentPalette));
});

// Función que inicializa la app leyendo el localStorage
function initApp() {
    // 1. Buscamos si hay datos guardados con la llave 'colorist_palette'
    const savedData = localStorage.getItem('colorist_palette');
    
    if (savedData) {
        // 2. Si hay datos, los transformamos de texto JSON a un arreglo de JS
        const savedPalette = JSON.parse(savedData);
        
        // 3. Ajustamos el <select> para que muestre la cantidad correcta
        paletteSizeSelect.value = savedPalette.length;
        
        // 4. Dibujamos las tarjetas iterando sobre el arreglo guardado
        paletteContainer.innerHTML = '';
        savedPalette.forEach(color => {
            const colorCard = document.createElement('div');
            colorCard.classList.add('color-card');
            
            // Estructura HTML actualizada incluyendo el candado (por defecto abierto)
            colorCard.innerHTML = `
                <div class="color-display" style="background-color: ${color};"></div>
                <button class="lock-btn">🔓</button>
                <div class="color-info">${color}</div>
            `;
            
            // Funcionalidad del candado para las tarjetas recuperadas
            const lockBtn = colorCard.querySelector('.lock-btn');
            lockBtn.addEventListener('click', (evento) => {
                evento.stopPropagation(); 
                colorCard.classList.toggle('locked');
                lockBtn.textContent = colorCard.classList.contains('locked') ? '🔒' : '🔓';
            });
            
            // Funcionalidad de copiar al portapapeles
            colorCard.addEventListener('click', () => {
                copyToClipboard(color);
            });
            
            paletteContainer.appendChild(colorCard);
        });
    } else {
        // 5. Si no hay nada guardado (es la primera visita), simulamos un clic
        generateBtn.click();
    }
}

// Ejecutamos la función apenas carga el script
initApp();