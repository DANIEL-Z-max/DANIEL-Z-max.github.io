// Configuración de la API
const API_KEY = "ac26b848";
const API_URL = "https://www.omdbapi.com/";

// Elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const moviesContainer = document.getElementById('moviesContainer');
const movieModal = document.getElementById('movieModal');
const closeModal = document.querySelector('.close-modal');
const yearFilter = document.getElementById('yearFilter');
const genreFilter = document.getElementById('genreFilter');
const ratingFilter = document.getElementById('ratingFilter');
const themeSwitch = document.querySelector('.theme-switch');
const showFavoritesBtn = document.getElementById('showFavorites');
const userMenu = document.getElementById('userMenu');
const loginBtn = document.getElementById('loginBtn');
const profileBtn = document.getElementById('profileBtn');

// Estado de la aplicación
let currentMovies = [];
let favorites = JSON.parse(localStorage.getItem('movieFavorites')) || [];
let lastSearchTerm = '';
let isShowingFavorites = false;
let currentUser = null;

// Función para manejar el cambio de tema
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = themeSwitch.querySelector('i');
    if (theme === 'light') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    showNotification(`Tema ${newTheme === 'light' ? 'claro' : 'oscuro'} activado`, 'info');
}

// Funciones de autenticación
async function initializeAuth() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await syncUserData();
            showNotification('Sesión iniciada correctamente', 'success');
            userMenu.querySelector('.user-email').textContent = user.email;
            userMenu.classList.remove('hidden');
            loginBtn.classList.add('hidden');
        } else {
            currentUser = null;
            userMenu.classList.add('hidden');
            loginBtn.classList.remove('hidden');
        }
    });
}

async function login() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    } catch (error) {
        showNotification('Error al iniciar sesión', 'error');
        console.error(error);
    }
}

async function logout() {
    try {
        await auth.signOut();
        showNotification('Sesión cerrada correctamente', 'info');
    } catch (error) {
        showNotification('Error al cerrar sesión', 'error');
        console.error(error);
    }
}

// Sincronización de datos
async function syncUserData() {
    if (!currentUser) return;

    // Sincronizar favoritos
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    if (userDoc.exists) {
        const userData = userDoc.data();
        favorites = userData.favorites || [];
        updateFavoritesButton();
    }
}

// Inicialización
function initializeApp() {
    initTheme();
    initializeAuth();
    updateFavoritesButton();
    loadFavorites();
}

// Función para cargar favoritos
function loadFavorites() {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
        updateFavoritesButton();
    }
}

// Búsqueda de películas
async function searchMovies() {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm && !isShowingFavorites) {
        showNotification('Por favor, escribe un nombre de película', 'warning');
        return;
    }

    lastSearchTerm = searchTerm;
    isShowingFavorites = false;
    showLoader();

    try {
        const searchUrl = `${API_URL}?s=${encodeURIComponent(searchTerm)}&apikey=${API_KEY}`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.Response === "False" || !data.Search || data.Search.length === 0) {
            showNotification(`No se encontraron películas con: ${searchTerm}`, 'warning');
            moviesContainer.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron resultados para "${searchTerm}"</p>
                    <p>Sugerencias:</p>
                    <ul>
                        <li>Verifica que el título esté bien escrito</li>
                        <li>Intenta usar menos palabras</li>
                        <li>Prueba con palabras clave diferentes</li>
                    </ul>
                </div>`;
            return;
        }

        const moviePromises = data.Search.map(async movie => {
            try {
                const details = await fetchMovieDetails(movie.imdbID);
                return details;
            } catch (error) {
                console.error(`Error al obtener detalles de ${movie.Title}:`, error);
                return null;
            }
        });

        const movies = await Promise.all(moviePromises);
        currentMovies = movies.filter(movie => movie !== null);
        
        if (currentMovies.length > 0) {
            displayMovies(currentMovies);
            showNotification(`Se encontraron ${currentMovies.length} películas`, 'success');
        } else {
            showNotification('No se pudieron cargar los detalles de las películas', 'error');
            moviesContainer.innerHTML = '<div class="no-results">Error al cargar los resultados</div>';
        }
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        showNotification('Error al buscar películas', 'error');
        moviesContainer.innerHTML = '<div class="no-results">Error al realizar la búsqueda</div>';
    } finally {
        hideLoader();
    }
}

// Obtener detalles de película
async function fetchMovieDetails(imdbID) {
    const url = `${API_URL}?i=${imdbID}&apikey=${API_KEY}&plot=full`;
    const response = await fetch(url);
    return response.json();
}

// Mostrar películas
function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    if (!movies || movies.length === 0) {
        moviesContainer.innerHTML = '<div class="no-results">No hay películas para mostrar</div>';
        return;
    }

    const fragment = document.createDocumentFragment();

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        fragment.appendChild(movieCard);
    });

    moviesContainer.appendChild(fragment);
}

// Crear tarjeta de película
function createMovieCard(movie) {
    const template = document.getElementById('movie-template');
    const movieElement = template.content.cloneNode(true);
    const card = movieElement.querySelector('.movie-card');

    // Configurar imagen
    const img = movieElement.querySelector('img');
    img.src = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';
    img.alt = movie.Title;

    // Configurar información básica
    movieElement.querySelector('.movie-title').textContent = movie.Title;
    movieElement.querySelector('.movie-year').textContent = movie.Year;
    movieElement.querySelector('.movie-rating span').textContent = movie.imdbRating;

    // Configurar géneros
    const genresContainer = movieElement.querySelector('.movie-genres');
    movie.Genre.split(', ').forEach(genre => {
        const genreTag = document.createElement('span');
        genreTag.className = 'genre-tag';
        genreTag.textContent = genre;
        genresContainer.appendChild(genreTag);
    });

    // Marcar si está en favoritos
    if (isFavorite(movie)) {
        card.classList.add('favorite');
    }

    // Evento para mostrar detalles
    card.addEventListener('click', () => showMovieDetails(movie));

    return movieElement;
}

// Mostrar detalles de película
async function showMovieDetails(movie) {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalOverview = document.getElementById('modalOverview');
    const modalYear = document.getElementById('modalYear');
    const modalGenres = document.getElementById('modalGenres');
    const modalRating = document.getElementById('modalRating');
    const modalDuration = document.getElementById('modalDuration');
    const addFavoriteBtn = document.getElementById('addFavorite');
    const watchTrailerBtn = document.getElementById('watchTrailer');

    // Actualizar contenido del modal
    modalImage.src = movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image';
    modalTitle.textContent = movie.Title;
    modalYear.textContent = movie.Year;
    modalGenres.textContent = movie.Genre;
    modalRating.textContent = `${movie.imdbRating}/10 ⭐`;
    modalDuration.textContent = movie.Runtime;

    // Traducir sinopsis
    try {
        const translatedPlot = await translateText(movie.Plot);
        modalOverview.textContent = translatedPlot;
    } catch (error) {
        modalOverview.textContent = movie.Plot;
        console.error('Error al traducir:', error);
    }

    // Configurar botón de favoritos
    const isFav = isFavorite(movie);
    addFavoriteBtn.innerHTML = `
        <i class="fas fa-heart"></i>
        <span>${isFav ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}</span>
    `;
    addFavoriteBtn.onclick = () => toggleFavorite(movie);

    // Configurar botón de trailer
    watchTrailerBtn.onclick = () => searchAndPlayTrailer(movie.Title, movie.Year);

    movieModal.style.display = 'block';
}

// Gestión de favoritos
function toggleFavorite(movie) {
    const index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);
    
    if (index === -1) {
        favorites.push(movie);
        showNotification('Película agregada a favoritos', 'success');
    } else {
        favorites.splice(index, 1);
        showNotification('Película eliminada de favoritos', 'info');
        
        if (isShowingFavorites) {
            displayMovies(favorites);
        }
    }
    
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
    updateFavoritesButton();
    updateMovieCardStatus(movie);
    
    // Actualizar el botón en el modal si está abierto
    const addFavoriteBtn = document.getElementById('addFavorite');
    if (addFavoriteBtn) {
        const isFav = isFavorite(movie);
        addFavoriteBtn.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>${isFav ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}</span>
        `;
    }
}

// Función para actualizar el contador de favoritos
function updateFavoritesButton() {
    const counter = document.createElement('span');
    counter.className = 'favorites-counter';
    counter.textContent = favorites.length;

    const existingCounter = showFavoritesBtn.querySelector('.favorites-counter');
    if (existingCounter) {
        existingCounter.remove();
    }

    if (favorites.length > 0) {
        showFavoritesBtn.appendChild(counter);
    }
}

// Función para verificar si una película está en favoritos
function isFavorite(movie) {
    return favorites.some(fav => fav.imdbID === movie.imdbID);
}

// Función para actualizar el estado visual de las tarjetas
function updateMovieCardStatus(movie) {
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach(card => {
        const titleElement = card.querySelector('.movie-title');
        if (titleElement && titleElement.textContent === movie.Title) {
            card.classList.toggle('favorite', isFavorite(movie));
        }
    });
}

// Mostrar favoritos
function toggleFavorites() {
    isShowingFavorites = !isShowingFavorites;
    showFavoritesBtn.classList.toggle('active');

    if (isShowingFavorites) {
        if (favorites.length === 0) {
            moviesContainer.innerHTML = '<div class="no-favorites">No tienes películas favoritas</div>';
            showNotification('No hay películas favoritas', 'info');
        } else {
            displayMovies(favorites);
            showNotification(`Mostrando ${favorites.length} películas favoritas`, 'success');
        }
    } else {
        if (lastSearchTerm) {
            searchInput.value = lastSearchTerm;
            searchMovies();
        } else {
            moviesContainer.innerHTML = '';
        }
    }
}

// Traducción
async function translateText(text) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data[0].map(x => x[0]).join('');
    } catch (error) {
        console.error('Error en la traducción:', error);
        return text; // Devolver texto original si falla la traducción
    }
}

// Buscar y reproducir trailer
function searchAndPlayTrailer(title, year) {
    const query = `${title} ${year} trailer oficial español`;
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank');
}

// Utilidades
function showLoader() {
    moviesContainer.innerHTML = `
        <div class="loader">
            <div class="loader-content">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Buscando películas...</span>
            </div>
        </div>`;
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>`;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    return {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';
}

// Cerrar modal al hacer clic fuera de él
window.onclick = (event) => {
    if (event.target === movieModal) {
        movieModal.style.display = 'none';
    }
};

// Service Worker para funcionalidad offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado');
            })
            .catch(error => {
                console.error('Error al registrar ServiceWorker:', error);
            });
    });
}

// Event listener para cerrar el modal al hacer clic fuera
window.onclick = (event) => {
    if (event.target === movieModal) {
        movieModal.style.display = 'none';
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateFavoritesButton();
    loadFavorites();
    
    // Añadir event listeners para búsqueda
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });
    
    searchButton.addEventListener('click', searchMovies);
    
    // Event listener para favoritos
    showFavoritesBtn.addEventListener('click', toggleFavorites);
    
    // Event listener para cerrar modal
    closeModal.addEventListener('click', () => movieModal.style.display = 'none');
});
