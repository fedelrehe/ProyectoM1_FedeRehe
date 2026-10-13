// =========================================
// 1. CAPTURA DE ELEMENTOS DEL DOM
// =========================================
// Principales
const generateBtn = document.getElementById('generate-btn');
const paletteSizeSelect = document.getElementById('palette-size');
const paletteContainer = document.getElementById('palette-container');
const toast = document.getElementById('toast');

// Historial
const historyLink = document.getElementById('history-link');
const historyModal = document.getElementById('history-modal');
const closeHistoryBtn = document.getElementById('close-history-btn');
const historyContainer = document.getElementById('history-container');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// =========================================
// 2. FUNCIONES UTILITARIAS
// =========================================

// Generador de color HEX
function getRandomHexColor() {
    const characters = '0123456789ABCDEF';
    let hex = '#';
    for (let i = 0; i < 6; i++) {
        const indiceAleatorio = Math.floor(Math.random() * characters.length);
        hex += characters[indiceAleatorio];
    }
    return hex;
}

// Copiar al portapapeles y mostrar Toast
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

// =========================================
// 3. EVENTO PRINCIPAL: GENERAR PALETA
// =========================================
generateBtn.addEventListener('click', () => {
    const size = parseInt(paletteSizeSelect.value);
    
    // ANTES de borrar, capturamos las tarjetas que ya están en pantalla para ver si hay candados
    const existingCards = paletteContainer.querySelectorAll('.color-card');
    
    paletteContainer.innerHTML = '';
    const currentPalette = [];
    
    for (let i = 0; i < size; i++) {
        let randomColor;
        let isLocked = false;
        
        // Revisamos si la tarjeta existe y está bloqueada
        if (existingCards[i] && existingCards[i].classList.contains('locked')) {
            randomColor = existingCards[i].querySelector('.color-info').textContent;
            isLocked = true;
        } else {
            randomColor = getRandomHexColor();
        }
        
        currentPalette.push(randomColor);
        
        const colorCard = document.createElement('div');
        colorCard.classList.add('color-card');
        
        if (isLocked) {
            colorCard.classList.add('locked');
        }
        
        colorCard.innerHTML = `
            <div class="color-display" style="background-color: ${randomColor};"></div>
            <button class="lock-btn">${isLocked ? '🔒' : '🔓'}</button>
            <div class="color-info">${randomColor}</div>
        `;
        
        // Lógica del botón de candado
        const lockBtn = colorCard.querySelector('.lock-btn');
        lockBtn.addEventListener('click', (evento) => {
            evento.stopPropagation(); 
            colorCard.classList.toggle('locked');
            lockBtn.textContent = colorCard.classList.contains('locked') ? '🔒' : '🔓';
        });
        
        // Lógica de copiar al hacer clic
        colorCard.addEventListener('click', () => {
            copyToClipboard(randomColor);
        });
        
        paletteContainer.appendChild(colorCard);
    }
    
    // Guardamos la paleta actual en pantalla
    localStorage.setItem('colorist_palette', JSON.stringify(currentPalette));
    
    // Guardamos una copia en nuestro "Cajón de Historial"
    let history = JSON.parse(localStorage.getItem('colorist_history')) || [];
    history.unshift(currentPalette); // La coloca de primera
    if (history.length > 20) history.pop(); // Máximo de 20 paletas en memoria
    localStorage.setItem('colorist_history', JSON.stringify(history));
});

// =========================================
// 4. LÓGICA DE INICIALIZACIÓN (Cargar datos)
// =========================================
function initApp() {
    const savedData = localStorage.getItem('colorist_palette');
    
    if (savedData) {
        const savedPalette = JSON.parse(savedData);
        paletteSizeSelect.value = savedPalette.length;
        paletteContainer.innerHTML = '';
        
        savedPalette.forEach(color => {
            const colorCard = document.createElement('div');
            colorCard.classList.add('color-card');
            
            colorCard.innerHTML = `
                <div class="color-display" style="background-color: ${color};"></div>
                <button class="lock-btn">🔓</button>
                <div class="color-info">${color}</div>
            `;
            
            const lockBtn = colorCard.querySelector('.lock-btn');
            lockBtn.addEventListener('click', (evento) => {
                evento.stopPropagation(); 
                colorCard.classList.toggle('locked');
                lockBtn.textContent = colorCard.classList.contains('locked') ? '🔒' : '🔓';
            });
            
            colorCard.addEventListener('click', () => {
                copyToClipboard(color);
            });
            
            paletteContainer.appendChild(colorCard);
        });
    } else {
        generateBtn.click();
    }
}

// =========================================
// 5. LÓGICA DE LA VENTANA MODAL DEL HISTORIAL
// =========================================

// Abrir la ventana
historyLink.addEventListener('click', (e) => {
    e.preventDefault();
    renderHistory();
    historyModal.classList.remove('hidden');
});

// Cerrar la ventana
closeHistoryBtn.addEventListener('click', () => {
    historyModal.classList.add('hidden');
});

// Borrar historial
clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('colorist_history');
    renderHistory(); 
});

// Función para dibujar las mini-paletas
function renderHistory() {
    historyContainer.innerHTML = '';
    let history = JSON.parse(localStorage.getItem('colorist_history')) || [];
    
    if (history.length === 0) {
        historyContainer.innerHTML = '<p style="color:#888; text-align:center;">Aún no tienes paletas en tu historial.</p>';
        return;
    }
    
    history.forEach(palette => {
        const item = document.createElement('div');
        item.classList.add('history-item');
        
        palette.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.classList.add('history-color');
            colorDiv.style.backgroundColor = color;
            item.appendChild(colorDiv);
        });
        
        // Al hacer clic en una paleta antigua, la cargamos en la vista principal
        item.addEventListener('click', () => {
            localStorage.setItem('colorist_palette', JSON.stringify(palette));
            historyModal.classList.add('hidden');
            initApp();
        });
        
        historyContainer.appendChild(item);
    });
}

// =========================================
// 6. EJECUTAR AL CARGAR LA PÁGINA
// =========================================
initApp();