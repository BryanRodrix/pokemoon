const listaPokemon = document.querySelector("#listaPokemon");
const navFilter = document.querySelector("#navFilter");
const searchInput = document.querySelector("#searchInput");
const modalOverlay = document.querySelector("#modalOverlay");
const closeModal = document.querySelector("#closeModal");

const modalImg = document.querySelector("#modalImg");
const modalId = document.querySelector("#modalId");
const modalTitle = document.querySelector("#modalTitle");
const modalTypes = document.querySelector("#modalTypes");
const modalStats = document.querySelector("#modalStats");

let todosLosPokemones = [];

function traducirTipo(tipo) {
    const traducciones = {
        normal: "normal", fire: "fuego", water: "agua", grass: "planta",
        electric: "eléctrico", ice: "hielo", fighting: "lucha", poison: "veneno",
        ground: "tierra", flying: "volador", psychic: "psíquico", bug: "bicho",
        rock: "roca", ghost: "fantasma", dragon: "dragón", steel: "acero", fairy: "hada"
    };
    return traducciones[tipo] || tipo;
}

function traducirStat(stat) {
    const traducciones = {
        "hp": "PS",
        "attack": "Ataque",
        "defense": "Defensa",
        "special-attack": "At. Especial",
        "special-defense": "Def. Especial",
        "speed": "Velocidad"
    };
    return traducciones[stat] || stat;
}

async function cargarPokemones() {
    for (let i = 1; i <= 40; i++) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const data = await response.json();
            todosLosPokemones.push(data);
        } catch (error) {
            console.error("Error al cargar el pokémon", error);
        }
    }
    mostrarPokemones(todosLosPokemones);
}

function mostrarPokemones(pokemones) {
    listaPokemon.innerHTML = "";
    pokemones.forEach(pokemon => {
        const tipos = pokemon.types.map(t => `<span class="${t.type.name}">${traducirTipo(t.type.name)}</span>`).join('');
        const pokeId = String(pokemon.id).padStart(3, '0');

        const div = document.createElement("div");
        div.classList.add("card-pokemon");
        div.innerHTML = `
            <div class="card-img">
                <img src="${pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            <div class="card-info">
                <span class="pokemon-id">N° ${pokeId}</span>
                <h3>${pokemon.name}</h3>
                <div class="card-types">
                    ${tipos}
                </div>
            </div>
        `;

        div.addEventListener("click", () => {
            abrirModal(pokemon);
        });

        listaPokemon.append(div);
    });
}

function abrirModal(pokemon) {
    modalImg.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
    modalId.textContent = `N° ${String(pokemon.id).padStart(3, '0')}`;
    modalTitle.textContent = pokemon.name;
    
    modalTypes.innerHTML = pokemon.types.map(t => `<span class="${t.type.name}">${traducirTipo(t.type.name)}</span>`).join('');

    modalStats.innerHTML = "";
    pokemon.stats.forEach(stat => {
        const nombreStat = traducirStat(stat.stat.name);
        const valorStat = stat.base_stat;
        
        modalStats.innerHTML += `
            <div class="stat-row">
                <span>${nombreStat}</span>
                <span>${valorStat}</span>
            </div>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${Math.min(valorStat, 100)}%;"></div>
            </div>
        `;
    });

    modalOverlay.classList.add("active");
}

closeModal.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
});

modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active");
    }
});

navFilter.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn-header")) return;

    const botones = navFilter.querySelectorAll(".btn-header");
    botones.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    const tipoSeleccionado = e.target.getAttribute("data-type");

    if (tipoSeleccionado === "all") {
        mostrarPokemones(todosLosPokemones);
    } else {
        const filtrados = todosLosPokemones.filter(pokemon => 
            pokemon.types.some(t => t.type.name === tipoSeleccionado)
        );
        mostrarPokemones(filtrados);
    }
});

searchInput.addEventListener("input", (e) => {
    const termino = e.target.value.toLowerCase().trim();

    const filtrados = todosLosPokemones.filter(pokemon => {
        const nombre = pokemon.name.toLowerCase();
        const id = String(pokemon.id);
        return nombre.includes(termino) || id.includes(termino);
    });

    mostrarPokemones(filtrados);
});

cargarPokemones();
// Capturar elementos del Modal
const modalOverlay = document.querySelector("#modalOverlay");
const closeModal = document.querySelector("#closeModal");
const modalImg = document.querySelector("#modalImg");
const modalId = document.querySelector("#modalId");
const modalTitle = document.querySelector("#modalTitle");
const modalTypes = document.querySelector("#modalTypes");
const modalStats = document.querySelector("#modalStats");

// Función auxiliar para traducir nombres de estadísticas si usas la API en inglés
function traducirStat(stat) {
    const traducciones = {
        "hp": "PS", "attack": "Ataque", "defense": "Defensa",
        "special-attack": "At. Especial", "special-defense": "Def. Especial", "speed": "Velocidad"
    };
    return traducciones[stat] || stat;
}

// Función para abrir y rellenar el modal (Llámala dentro de tu función que crea las tarjetas al hacer click)
function abrirModal(pokemon) {
    modalImg.src = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
    modalId.textContent = `N° ${pokemon.id}`;
    modalTitle.textContent = pokemon.name;
    
    // Copiar los tipos del pokémon al modal
    modalTypes.innerHTML = pokemon.types.map(t => `<span class="${t.type.name}">${t.type.name}</span>`).join('');

    // Rellenar las estadísticas en forma de barras
    modalStats.innerHTML = "";
    pokemon.stats.forEach(stat => {
        const nombreStat = traducirStat(stat.stat.name);
        const valorStat = stat.base_stat;
        
        modalStats.innerHTML += `
            <div class="stat-row">
                <span>${nombreStat}</span>
                <span>${valorStat}</span>
            </div>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${Math.min(valorStat, 100)}%;"></div>
            </div>
        `;
    });

    modalOverlay.classList.add("active");
}

// Eventos para cerrar el modal
if (closeModal) {
    closeModal.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove("active");
        }
    });
}