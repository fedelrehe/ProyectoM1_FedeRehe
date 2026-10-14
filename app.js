// =========================================
// 1. CAPTURA DE ELEMENTOS DEL DOM
// =========================================
const generateBtn = document.getElementById('generate-btn');
const paletteSizeSelect = document.getElementById('palette-size');
const paletteContainer = document.getElementById('palette-container');
const toast = document.getElementById('toast');
const formatToggle = document.getElementById('format-toggle');


const historyLink = document.getElementById('history-link');
const historyModal = document.getElementById('history-modal');
const closeHistoryBtn = document.getElementById('close-history-btn');
const historyContainer = document.getElementById('history-container');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// =========================================
// 2. FUNCIONES UTILITARIAS
// =========================================

function getRandomHexColor() {
    const characters = '0123456789ABCDEF';
    let hex = '#';
    for (let i = 0; i < 6; i++) {
        const indiceAleatorio = Math.floor(Math.random() * characters.length);
        hex += characters[indiceAleatorio];
    }
    return hex;
}

// =========================================
// CONVERSORES DE FORMATO DE COLOR
// =========================================

function hexToHsl(hex) {
    hex = hex.replace(/^#/, '');
    
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; 
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function hslToHex(hslString) {
    
    let valores = hslString.match(/\d+/g);
    let h = parseInt(valores[0]) / 360;
    let s = parseInt(valores[1]) / 100;
    let l = parseInt(valores[2]) / 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; 
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = x => {
        const hexVal = Math.round(x * 255).toString(16);
        return hexVal.length === 1 ? '0' + hexVal : hexVal;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
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

// =========================================
// 3. EVENTO PRINCIPAL: GENERAR PALETA
// =========================================
generateBtn.addEventListener('click', () => {
    const size = parseInt(paletteSizeSelect.value);
    
    const existingCards = paletteContainer.querySelectorAll('.color-card');
    
    paletteContainer.innerHTML = '';
    const currentPalette = [];
    
    for (let i = 0; i < size; i++) {
        let randomColor;
        let isLocked = false;
        
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
        
        const lockBtn = colorCard.querySelector('.lock-btn');
        lockBtn.addEventListener('click', (evento) => {
            evento.stopPropagation(); 
            colorCard.classList.toggle('locked');
            lockBtn.textContent = colorCard.classList.contains('locked') ? '🔒' : '🔓';
        });
        
            colorCard.addEventListener('click', () => {
            copyToClipboard(randomColor);
        });
        
        paletteContainer.appendChild(colorCard);
    }
    
    
    localStorage.setItem('colorist_palette', JSON.stringify(currentPalette));
    
    let history = JSON.parse(localStorage.getItem('colorist_history')) || [];
    history.unshift(currentPalette); 
    if (history.length > 20) history.pop(); 
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
            const currentDisplayedColor = colorCard.querySelector('.color-info').textContent;
            copyToClipboard(currentDisplayedColor);
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

historyLink.addEventListener('click', (e) => {
    e.preventDefault();
    renderHistory();
    historyModal.classList.remove('hidden');
});

closeHistoryBtn.addEventListener('click', () => {
    historyModal.classList.add('hidden');
});

clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('colorist_history');
    renderHistory(); 
});

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
        
            item.addEventListener('click', () => {
            localStorage.setItem('colorist_palette', JSON.stringify(palette));
            historyModal.classList.add('hidden');
            initApp();
        });
        
        historyContainer.appendChild(item);
    });
}

formatToggle.addEventListener('change', () => {
    
    const isHslFormat = formatToggle.checked; 
    
    const colorInfos = document.querySelectorAll('.color-info');
    
    colorInfos.forEach(info => {
        const currentText = info.textContent.trim();
        
        if (isHslFormat && currentText.startsWith('#')) {
           
            info.textContent = hexToHsl(currentText);
        } else if (!isHslFormat && currentText.startsWith('hsl')) {
            
            info.textContent = hslToHex(currentText);
        }
    });
});

initApp();