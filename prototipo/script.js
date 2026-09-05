/**
 * ====================================================================
 * J MUSIC - FRONTEND APPLICATION SCRIPT
 * YouTube Music Style Prototype with Collapsible Sidebar & Explicit IDs
 * ====================================================================
 */

// ====================================================================
// 1. GLOBAL STATE MANAGEMENT
// ====================================================================
let currentSongList = [];
let currentSongIndex = -1;
let currentSong = null;
let isPlaying = false;
let isPanelOpen = true;
let isMuted = false;
let previousVolume = 0.7;
let isShuffle = false;
let isRepeat = false;

// Persistencia en LocalStorage para Favoritos
let favorites = JSON.parse(localStorage.getItem('jmusic_favs')) || [];

// ====================================================================
// 2. DOM ELEMENT REFERENCES
// ====================================================================
// Navigation & Panels
const nowPlayingPanel = document.getElementById('now-playing-panel');
const headerTogglePanelBtn = document.getElementById('header-toggle-panel-btn');
const closePanelBtn = document.getElementById('close-panel-btn');
const floatingOpenPanelBtn = document.getElementById('floating-open-panel-btn');
const bottomTogglePanelBtn = document.getElementById('bottom-toggle-panel-btn');

// Search Elements
const searchInput = document.getElementById('search-input');
const headerSearchInput = document.getElementById('header-search-input');
const searchBtn = document.getElementById('search-btn');
const headerSearchBtn = document.getElementById('header-search-btn');
const clearSearchBtn = document.getElementById('clear-search-btn');
const tagChips = document.querySelectorAll('.tag-chip');
const statusMessage = document.getElementById('status-message');
const resultsGrid = document.getElementById('results-grid');
const resultsHeader = document.getElementById('results-header');
const resultsCount = document.getElementById('results-count');

// Left Side "Now Playing" Panel Elements
const panelStandby = document.getElementById('panel-standby');
const panelActive = document.getElementById('panel-active');
const panelCoverImg = document.getElementById('panel-cover-img');
const panelCoverGlow = document.getElementById('panel-cover-glow');
const panelSongTitle = document.getElementById('panel-song-title');
const panelSongArtist = document.getElementById('panel-song-artist');
const panelSongId = document.getElementById('panel-song-id');
const copyPanelIdBtn = document.getElementById('copy-panel-id-btn');
const panelFavBtn = document.getElementById('panel-fav-btn');
const panelPlayTrigger = document.getElementById('panel-play-trigger');
const panelPlayText = document.getElementById('panel-play-text');
const panelEqualizer = document.getElementById('panel-equalizer');

// Persistent Bottom Player Elements
const audio = document.getElementById('audio-player');
const playerBar = document.getElementById('player-bar');
const currentImg = document.getElementById('current-img');
const currentTitle = document.getElementById('current-title');
const currentArtist = document.getElementById('current-artist');
const playerSongId = document.getElementById('player-song-id');
const favBtn = document.getElementById('fav-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const currentTimeLabel = document.getElementById('current-time');
const totalTimeLabel = document.getElementById('total-time');
const volumeBar = document.getElementById('volume-bar');
const volumeFill = document.getElementById('volume-fill');
const volumeIconBtn = document.getElementById('volume-icon-btn');
const volHighSvg = document.getElementById('vol-high-svg');
const volMuteSvg = document.getElementById('vol-mute-svg');
const miniEq = document.getElementById('mini-eq');

// Sample audio URLs for realistic playback demonstration
const SAMPLE_AUDIO_URLS = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
];

// Curated high quality music cover images for rich presentation
const SAMPLE_COVERS = [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80"
];

// ====================================================================
// 3. BACKEND INTEGRATION & MOCK SIMULATION
// ====================================================================

/**
 * Simula o conecta con la API de búsqueda del backend Node.js en Render.
 * @param {string} query Término de búsqueda
 * @returns {Promise<Array>} Lista de objetos con id, title, artist, duration, thumbnail
 */
async function mockBackendSearch(query) {
    /* ------------------------------------------------------------------
       TODO (RENDER BACKEND INTEGRATION):
       Reemplazar esta simulación con la llamada real al backend Node.js:
       
       const BACKEND_URL = "https://tu-servicio-jmusic.onrender.com";
       const response = await fetch(`${BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`);
       if (!response.ok) throw new Error("Error en el servidor de Render");
       return await response.json();
       ------------------------------------------------------------------ */

    // Simular latencia de red (600ms)
    await new Promise(resolve => setTimeout(resolve, 600));

    // Generador de datos enriquecidos con IDs únicos explícitos (ej. vid_1728391_0)
    const timestampSeed = Date.now().toString().slice(-6);
    const artistsList = ["Alan Walker", "Dua Lipa", "The Weeknd", "Skrillex", "Billie Eilish", "Coldplay", "Bad Bunny", "Rosalía", "Daft Punk", "Avicii", "Marshmello", "Imagine Dragons"];

    return Array.from({ length: 12 }, (_, i) => {
        const uniqueId = `vid_${timestampSeed}_${i + 1}`;
        const artist = artistsList[i % artistsList.length];
        const cover = SAMPLE_COVERS[i % SAMPLE_COVERS.length];
        const minutes = Math.floor(Math.random() * 3) + 2;
        const seconds = Math.floor(Math.random() * 50) + 10;

        return {
            id: uniqueId,
            title: `${query} - Mix Edición #${i + 1}`,
            artist: artist,
            duration: `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`,
            thumbnail: cover
        };
    });
}

/**
 * Simula o conecta con la extracción de flujo de audio (.googlevideo / stream)
 * @param {string} songId Identificador único de la canción
 * @returns {Promise<string>} URL del stream de audio para el elemento <audio>
 */
async function mockExtractAudio(songId) {
    /* ------------------------------------------------------------------
       TODO (RENDER BACKEND INTEGRATION):
       Reemplazar esta simulación con el extractor en cascada del backend:
       
       const BACKEND_URL = "https://tu-servicio-jmusic.onrender.com";
       const response = await fetch(`${BACKEND_URL}/api/stream?id=${encodeURIComponent(songId)}`);
       if (!response.ok) throw new Error("No se pudo obtener el stream de audio");
       const data = await response.json();
       return data.audioUrl;
       ------------------------------------------------------------------ */

    // Simular tiempo de extracción en cascada (500ms)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Retorna una pista de demostración estable
    const index = Math.abs(hashCode(songId)) % SAMPLE_AUDIO_URLS.length;
    return SAMPLE_AUDIO_URLS[index];
}

// Función auxiliar para hash simple
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

// ====================================================================
// 4. BÚSQUEDA Y RENDERIZADO DE RESULTADOS
// ====================================================================

// Eventos de búsqueda
searchBtn.addEventListener('click', () => triggerSearch(searchInput.value));
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') triggerSearch(searchInput.value);
});
searchInput.addEventListener('input', () => {
    clearSearchBtn.style.display = searchInput.value ? 'flex' : 'none';
});
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
});

// Búsqueda en Header
if (headerSearchBtn && headerSearchInput) {
    headerSearchBtn.addEventListener('click', () => triggerSearch(headerSearchInput.value));
    headerSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') triggerSearch(headerSearchInput.value);
    });
}

// Chips de tendencias
tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        searchInput.value = query;
        if (headerSearchInput) headerSearchInput.value = query;
        clearSearchBtn.style.display = 'flex';
        triggerSearch(query);
    });
});

async function triggerSearch(queryText) {
    const query = (queryText || '').trim();
    if (!query) return;

    // Sincronizar inputs
    searchInput.value = query;
    if (headerSearchInput) headerSearchInput.value = query;
    clearSearchBtn.style.display = 'flex';

    // Estados visuales: "Buscando canciones..."
    setStatus("Buscando canciones en la biblioteca...", "loading-msg");
    resultsGrid.innerHTML = '';
    resultsHeader.style.display = 'none';

    try {
        const songs = await mockBackendSearch(query);
        currentSongList = songs;
        renderResults(songs, query);
        clearStatus();
    } catch (error) {
        console.error("Error al buscar canciones:", error);
        setStatus("Error al conectar con el servidor. Intente de nuevo.", "error-msg");
    }
}

function setStatus(text, className = "") {
    statusMessage.textContent = text;
    statusMessage.className = `status-message ${className}`;
}

function clearStatus() {
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
}

/**
 * Renderizado de tarjetas con ID único explícito visible
 */
function renderResults(songs, query) {
    resultsGrid.innerHTML = '';
    resultsHeader.style.display = 'flex';
    resultsCount.textContent = `${songs.length} resultados para "${query}"`;

    songs.forEach((song, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-id', song.id);
        card.setAttribute('data-index', index);

        // Si es la canción actual activa
        if (currentSong && currentSong.id === song.id) {
            card.classList.add('active-playing');
        }

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img class="card-img" src="${song.thumbnail}" alt="${song.title}" loading="lazy">
                <span class="card-duration-badge">${song.duration}</span>
            </div>
            <div class="card-info">
                <div class="card-title" title="${song.title}">${song.title}</div>
                <div class="card-artist" title="${song.artist}">${song.artist}</div>
                
                <!-- 1. VISIBILIDAD DE ID ÚNICO EN LA TARJETA -->
                <div class="card-id-badge" title="Identificador de audio único">
                    <span class="badge-prefix">ID:</span>
                    <span>${song.id}</span>
                </div>

                <button class="card-play-btn" data-index="${index}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6 4 20 12 6 20 6 4"></polygon>
                    </svg>
                    <span>Reproducir</span>
                </button>
            </div>
        `;

        // Click en la tarjeta completa para reproducir
        card.addEventListener('click', () => {
            selectAndPlaySong(song, index);
        });

        resultsGrid.appendChild(card);
    });
}

// ====================================================================
// 5. CONTROL DE REPRODUCCIÓN & SELECCIÓN
// ====================================================================

/**
 * Selecciona una canción y activa todos los componentes visuales:
 * - Panel lateral izquierdo
 * - Barra inferior de reproducción
 * - Tarjetas activas
 */
async function selectAndPlaySong(song, index) {
    if (!song) return;

    currentSong = song;
    currentSongIndex = index >= 0 ? index : currentSongList.findIndex(s => s.id === song.id);

    // Actualizar estados visuales de carga
    setStatus(`Obteniendo flujo de audio para [${song.id}]...`, "loading-msg");

    // Actualizar Panel Izquierdo inmediatamente (Metadatos)
    updateLeftPanel(song);

    // Actualizar Barra de Reproductor Inferior
    updateBottomPlayerBar(song);

    // Resaltar tarjeta activa en el grid
    highlightActiveCard(song.id);

    try {
        // Llamada a la extracción de stream
        const audioUrl = await mockExtractAudio(song.id);
        
        audio.src = audioUrl;
        audio.currentTime = 0;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setPlayState(true);
                clearStatus();
            }).catch(err => {
                console.warn("Autoplay prevenido o error:", err);
                setPlayState(false);
                clearStatus();
            });
        }
    } catch (err) {
        console.error("Error al obtener stream de audio:", err);
        setStatus("Error al reproducir el flujo de audio.", "error-msg");
    }
}

/**
 * Actualiza el Panel "Reproduciendo Ahora" (Columna Izquierda)
 */
function updateLeftPanel(song) {
    // Pasar de Standby a Activo
    panelStandby.style.display = 'none';
    panelActive.style.display = 'flex';

    // Portada e imagen
    panelCoverImg.src = song.thumbnail;
    panelCoverGlow.style.backgroundImage = `url(${song.thumbnail})`;

    // Título y Artista
    panelSongTitle.textContent = song.title;
    panelSongArtist.textContent = song.artist;

    // 2. VISIBILIDAD DE ID ÚNICO EN EL PANEL LATERAL
    panelSongId.textContent = song.id;

    // Estado del botón favoritos
    checkFavStatus();

    // Auto-abrir panel si estaba colapsado para feedback visual
    if (!isPanelOpen) {
        toggleLeftPanel(true);
    }
}

/**
 * Actualiza la Barra Inferior Persistente
 */
function updateBottomPlayerBar(song) {
    currentImg.src = song.thumbnail;
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;

    // 3. VISIBILIDAD DE ID ÚNICO EN LA BARRA INFERIOR
    playerSongId.textContent = `ID: ${song.id}`;
    playerSongId.title = `ID único: ${song.id}`;

    checkFavStatus();
}

/**
 * Resalta la tarjeta activa en la cuadrícula de resultados
 */
function highlightActiveCard(songId) {
    document.querySelectorAll('.card').forEach(card => {
        if (card.getAttribute('data-id') === songId) {
            card.classList.add('active-playing');
        } else {
            card.classList.remove('active-playing');
        }
    });
}

function setPlayState(playing) {
    isPlaying = playing;
    if (playing) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        panelPlayText.textContent = 'Pausar Reproducción';
        document.body.classList.add('playing');
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        panelPlayText.textContent = 'Reanudar Reproducción';
        document.body.classList.remove('playing');
    }
}

// Botón Play/Pause Principal (Barra Inferior)
playPauseBtn.addEventListener('click', togglePlayPause);

// Botón Play/Pause en Panel Izquierdo
panelPlayTrigger.addEventListener('click', togglePlayPause);

function togglePlayPause() {
    if (!audio.src) {
        if (currentSongList.length > 0) {
            selectAndPlaySong(currentSongList[0], 0);
        }
        return;
    }

    if (isPlaying) {
        audio.pause();
        setPlayState(false);
    } else {
        audio.play().then(() => {
            setPlayState(true);
        }).catch(e => console.warn(e));
    }
}

// Canción Siguiente / Anterior
nextBtn.addEventListener('click', playNextSong);
prevBtn.addEventListener('click', playPrevSong);

function playNextSong() {
    if (currentSongList.length === 0) return;

    if (isShuffle) {
        const randIndex = Math.floor(Math.random() * currentSongList.length);
        selectAndPlaySong(currentSongList[randIndex], randIndex);
        return;
    }

    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= currentSongList.length) {
        nextIndex = 0; // Loop al inicio
    }
    selectAndPlaySong(currentSongList[nextIndex], nextIndex);
}

function playPrevSong() {
    if (currentSongList.length === 0) return;

    // Si lleva más de 3 segundos, reiniciar la canción actual
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) {
        prevIndex = currentSongList.length - 1;
    }
    selectAndPlaySong(currentSongList[prevIndex], prevIndex);
}

// Modo Repetir y Aleatorio
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? 'var(--accent-red)' : 'var(--text-secondary)';
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? 'var(--accent-red)' : 'var(--text-secondary)';
});

// ====================================================================
// 6. EVENTOS DE AUDIO, TIEMPO Y PROGRESO
// ====================================================================

audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    progressFill.style.width = `${progress}%`;

    currentTimeLabel.textContent = formatTime(audio.currentTime);
    totalTimeLabel.textContent = formatTime(audio.duration);
});

audio.addEventListener('loadedmetadata', () => {
    totalTimeLabel.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        playNextSong();
    }
});

audio.addEventListener('error', (e) => {
    console.error("Audio error:", e);
    setStatus("Error al reproducir el flujo de audio.", "error-msg");
    setPlayState(false);
});

// Scrubbing en la barra de progreso
progressBar.addEventListener('input', (e) => {
    if (!audio.duration) return;
    const seekTime = (e.target.value / 100) * audio.duration;
    progressFill.style.width = `${e.target.value}%`;
    currentTimeLabel.textContent = formatTime(seekTime);
});

progressBar.addEventListener('change', (e) => {
    if (!audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
});

// Control de Volumen
volumeBar.addEventListener('input', (e) => {
    const val = e.target.value;
    audio.volume = val / 100;
    volumeFill.style.width = `${val}%`;
    isMuted = val === '0';
    updateVolumeIcon();
});

volumeIconBtn.addEventListener('click', () => {
    if (isMuted) {
        audio.volume = previousVolume;
        volumeBar.value = previousVolume * 100;
        volumeFill.style.width = `${previousVolume * 100}%`;
        isMuted = false;
    } else {
        previousVolume = audio.volume || 0.7;
        audio.volume = 0;
        volumeBar.value = 0;
        volumeFill.style.width = '0%';
        isMuted = true;
    }
    updateVolumeIcon();
});

function updateVolumeIcon() {
    if (isMuted || audio.volume === 0) {
        volHighSvg.style.display = 'none';
        volMuteSvg.style.display = 'block';
    } else {
        volHighSvg.style.display = 'block';
        volMuteSvg.style.display = 'none';
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// ====================================================================
// 7. COLAPSO Y DESPLIEGUE DEL PANEL LATERAL
// ====================================================================

function toggleLeftPanel(forceOpen) {
    if (forceOpen !== undefined) {
        isPanelOpen = forceOpen;
    } else {
        isPanelOpen = !isPanelOpen;
    }

    if (isPanelOpen) {
        nowPlayingPanel.classList.remove('collapsed');
        floatingOpenPanelBtn.classList.remove('visible');
    } else {
        nowPlayingPanel.classList.add('collapsed');
        floatingOpenPanelBtn.classList.add('visible');
    }
}

headerTogglePanelBtn.addEventListener('click', () => toggleLeftPanel());
closePanelBtn.addEventListener('click', () => toggleLeftPanel(false));
floatingOpenPanelBtn.addEventListener('click', () => toggleLeftPanel(true));
bottomTogglePanelBtn.addEventListener('click', () => toggleLeftPanel());

// ====================================================================
// 8. FAVORITOS Y COPIAR ID ÚNICO
// ====================================================================

// Toggle de Favoritos
function toggleFavorite(song) {
    if (!song) return;

    const index = favorites.findIndex(s => s.id === song.id);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(song);
    }

    localStorage.setItem('jmusic_favs', JSON.stringify(favorites));
    checkFavStatus();
}

favBtn.addEventListener('click', () => toggleFavorite(currentSong));
panelFavBtn.addEventListener('click', () => toggleFavorite(currentSong));

function checkFavStatus() {
    if (!currentSong) {
        favBtn.classList.remove('active');
        panelFavBtn.classList.remove('active');
        return;
    }

    const isFav = favorites.some(s => s.id === currentSong.id);
    if (isFav) {
        favBtn.classList.add('active');
        panelFavBtn.classList.add('active');
    } else {
        favBtn.classList.remove('active');
        panelFavBtn.classList.remove('active');
    }
}

// Copiar ID Único al Portapapeles con Feedback Visual
copyPanelIdBtn.addEventListener('click', () => {
    if (!currentSong) return;
    navigator.clipboard.writeText(currentSong.id).then(() => {
        const originalText = panelSongId.textContent;
        panelSongId.textContent = "¡Copiado!";
        setTimeout(() => {
            panelSongId.textContent = originalText;
        }, 1200);
    }).catch(err => console.error("Error al copiar ID:", err));
});

// ====================================================================
// 9. ATAJOS DE TECLADO Y CARGA INICIAL
// ====================================================================

// Atajo: Barra espaciadora para Play / Pause (cuando no se escribe en inputs)
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlayPause();
    }
});

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Configuración de volumen por defecto
    audio.volume = 0.7;
    volumeFill.style.width = '70%';

    // Cargar catálogo inicial de tendencias
    triggerSearch("Top Global Hits");
});