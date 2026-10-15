// Nuestra "Base de datos" de paletas de inspiración
const palettesDatabase = [
    { id: 1, name: "Arcoíris", category: "vibrante", colors: ["#ff4b4b", "#f9c74f", "#43aa8b", "#00b4d8", "#9b5de5"] },
    { id: 2, name: "Boda", category: "pastel", colors: ["#f9f7f3", "#f4e8e1", "#e3d5ca", "#d5bdaf", "#d6ccc2"] },
    { id: 3, name: "Café", category: "cafe", colors: ["#ede0d4", "#e6ccb2", "#ddb892", "#b08968", "#7f5539"] },
    { id: 4, name: "Naturaleza", category: "naturaleza", colors: ["#e9edc9", "#ccd5ae", "#a3b18a", "#588157", "#3a5a40"] },
    { id: 5, name: "Mar", category: "verano", colors: ["#caf0f8", "#90e0ef", "#00b4d8", "#0077b6", "#03045e"] },
    { id: 6, name: "Atardecer", category: "otono", colors: ["#ffb703", "#fb8500", "#e63946", "#9d0208", "#370617"] },
    { id: 7, name: "Espacio", category: "espacio", colors: ["#0b090a", "#161a1d", "#660708", "#a4161a", "#e5383b"] },
    { id: 8, name: "Retro 80s", category: "retro", colors: ["#f72585", "#b5179e", "#7209b7", "#4361ee", "#4cc9f0"] },
    { id: 9, name: "Glaciar", category: "invierno", colors: ["#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd"] },
    { id: 10, name: "Brote Editorial", category: "primavera", colors: ["#F9F8F6", "#E3D5CA", "#A3B18A", "#E07A5F", "#1D3557"] }
];

const exploreGrid = document.getElementById('explore-grid');
const filterItems = document.querySelectorAll('.category-list li');

// Función para dibujar las tarjetas en pantalla
function renderExploreGrid(filterCategory = 'all') {
    exploreGrid.innerHTML = ''; // Limpiamos la grilla
    
    // Filtramos la base de datos
    const filteredPalettes = palettesDatabase.filter(palette => {
        if (filterCategory === 'all') return true;
        return palette.category === filterCategory;
    });

    if (filteredPalettes.length === 0) {
        exploreGrid.innerHTML = '<p style="color:#888; grid-column: 1 / -1;">No hay paletas para esta categoría aún.</p>';
        return;
    }

    // Dibujamos cada paleta
    filteredPalettes.forEach(palette => {
        const card = document.createElement('div');
        card.classList.add('explore-card');
        
        // Creamos las barras de color HTML
        let colorsHTML = '';
        palette.colors.forEach(color => {
            colorsHTML += `<div class="explore-color-bar" style="background-color: ${color};"></div>`;
        });
        
        card.innerHTML = `
            <div class="explore-card-colors">
                ${colorsHTML}
            </div>
            <div class="explore-card-footer">
                <span class="explore-card-title">${palette.name}</span>
                <span class="explore-card-action">♡</span>
            </div>
        `;
        
        // Cuando el usuario hace clic, llevamos esta paleta al generador principal
        card.addEventListener('click', () => {
            localStorage.setItem('colorist_palette', JSON.stringify(palette.colors));
            window.location.href = 'index.html'; // Lo redirigimos de vuelta a la página principal!
        });
        
        exploreGrid.appendChild(card);
    });
}

// Escuchar clics en el menú lateral
filterItems.forEach(item => {
    item.addEventListener('click', (e) => {
        // Quitar la clase 'active' de todos
        filterItems.forEach(li => li.classList.remove('active'));
        // Agregarla al elemento clicado
        e.target.classList.add('active');
        
        // Obtener la categoría y renderizar
        const category = e.target.getAttribute('data-filter');
        renderExploreGrid(category);
    });
});

// Al iniciar, mostramos la categoría Pastel (o la que tú prefieras)
renderExploreGrid('pastel');