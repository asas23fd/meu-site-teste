// ==================== CONFIGURATION ====================
const SOUNDCLOUD_CLIENT_ID = '5gMqC97v0l66zeEvGFHnZzO3hIi1xpUX';
const SOUNDCLOUD_API = 'https://api-v2.soundcloud.com';
const CORS_PROXY = 'https://corsproxy.io/?';

// ==================== STATE ====================
let currentTrack = null;
let currentPlaylist = [];
let currentIndex = -1;
let isPlaying = false;
let isMuted = false;
let previousVolume = 80;

// ==================== DOM ELEMENTS ====================
const searchInput = document.getElementById('searchInput');
const searchLoader = document.getElementById('searchLoader');
const trendingSection = document.getElementById('trendingSection');
const trendingTracks = document.getElementById('trendingTracks');
const searchSection = document.getElementById('searchSection');
const searchResults = document.getElementById('searchResults');
const emptyState = document.getElementById('emptyState');
const loadingState = document.getElementById('loadingState');
const playerBar = document.getElementById('playerBar');
const playerArtwork = document.getElementById('playerArtwork');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressKnob = document.getElementById('progressKnob');
const progressBarContainer = document.getElementById('progressBarContainer');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const volumeMuteIcon = document.getElementById('volumeMuteIcon');
const volumeSlider = document.getElementById('volumeSlider');
const audioPlayer = document.getElementById('audioPlayer');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
});

async function init() {
    audioPlayer.volume = 0.8;
    await loadTrending();
}

function setupEventListeners() {
    // Search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length === 0) {
            searchSection.classList.add('hidden');
            trendingSection.classList.remove('hidden');
            emptyState.classList.add('hidden');
            return;
        }

        searchTimeout = setTimeout(() => searchTracks(query), 500);
        searchLoader.classList.add('active');
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            const query = searchInput.value.trim();
            if (query) searchTracks(query);
        }
    });

    // Player controls
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    volumeBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', changeVolume);

    // Progress bar
    progressBarContainer.addEventListener('click', seekTo);

    // Audio events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', playNext);
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(audioPlayer.duration);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target === searchInput) return;
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        }
        if (e.code === 'ArrowRight') playNext();
        if (e.code === 'ArrowLeft') playPrevious();
    });
}

// ==================== SOUNDCLOUD API ====================
async function fetchSoundCloud(endpoint, params = {}) {
    const url = new URL(`${SOUNDCLOUD_API}${endpoint}`);
    url.searchParams.append('client_id', SOUNDCLOUD_CLIENT_ID);
    
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    const proxyUrl = CORS_PROXY + encodeURIComponent(url.toString());

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('SoundCloud API Error:', error);
        return null;
    }
}

// Get the real playable stream URL for a track
async function getStreamUrl(trackId) {
    // First get track details to find transcodings
    const trackData = await fetchSoundCloud(`/tracks/${trackId}`);
    if (!trackData || !trackData.media || !trackData.media.transcodings) {
        return null;
    }

    // Find progressive stream (direct MP3) - prefer this over HLS
    const progressive = trackData.media.transcodings.find(
        t => t.format && t.format.protocol === 'progressive'
    );
    
    const hls = trackData.media.transcodings.find(
        t => t.format && t.format.protocol === 'hls'
    );

    const transcoding = progressive || hls;
    if (!transcoding) return null;

    // Fetch the transcoding URL to get the actual CDN URL
    try {
        const transcodeUrl = transcoding.url + (transcoding.url.includes('?') ? '&' : '?') + 'client_id=' + SOUNDCLOUD_CLIENT_ID;
        const proxyUrl = CORS_PROXY + encodeURIComponent(transcodeUrl);
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data && data.url) {
            return data.url;
        }
    } catch (error) {
        console.error('Stream URL Error:', error);
    }
    
    return null;
}

async function loadTrending() {
    loadingState.classList.remove('hidden');
    trendingSection.classList.add('hidden');

    const data = await fetchSoundCloud('/search/tracks', {
        q: 'music',
        limit: 50,
        offset: 0
    });

    loadingState.classList.add('hidden');
    trendingSection.classList.remove('hidden');

    if (data && data.collection && data.collection.length > 0) {
        renderTracks(data.collection, trendingTracks);
    } else {
        trendingTracks.innerHTML = '<p style="color: var(--text-secondary); text-align: center; grid-column: 1/-1;">Não foi possível carregar as músicas. Tente novamente mais tarde.</p>';
    }
}

async function searchTracks(query) {
    searchLoader.classList.add('active');
    
    const data = await fetchSoundCloud('/search/tracks', {
        q: query,
        limit: 50,
        offset: 0
    });

    searchLoader.classList.remove('active');

    if (data && data.collection && data.collection.length > 0) {
        trendingSection.classList.add('hidden');
        searchSection.classList.remove('hidden');
        emptyState.classList.add('hidden');
        renderTracks(data.collection, searchResults);
    } else {
        trendingSection.classList.add('hidden');
        searchSection.classList.add('hidden');
        emptyState.classList.remove('hidden');
    }
}

// ==================== RENDERING ====================
function renderTracks(tracks, container) {
    container.innerHTML = '';
    
    const validTracks = tracks.filter(t => t && t.id);
    
    validTracks.forEach((track, index) => {
        const card = document.createElement('div');
        card.className = 'track-card';
        card.style.animationDelay = `${index * 0.03}s`;
        
        if (currentTrack && currentTrack.id === track.id) {
            card.classList.add('playing');
        }

        const artworkUrl = getArtworkUrl(track);
        const duration = track.duration ? formatTime(track.duration / 1000) : '--:--';

        card.innerHTML = `
            <div class="track-artwork-container">
                ${artworkUrl 
                    ? `<img class="track-artwork" src="${artworkUrl}" alt="${escapeHtml(track.title)}" loading="lazy">`
                    : `<div class="track-artwork-placeholder">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                    </div>`
                }
                <div class="track-play-overlay">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <div class="track-equalizer">
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                    <div class="eq-bar"></div>
                </div>
            </div>
            <div class="track-info">
                <div class="track-title" title="${escapeHtml(track.title)}">${escapeHtml(track.title)}</div>
                <div class="track-artist" title="${escapeHtml(track.user ? track.user.username : 'Desconhecido')}">${escapeHtml(track.user ? track.user.username : 'Desconhecido')}</div>
                <div class="track-duration">${duration}</div>
            </div>
        `;

        card.addEventListener('click', () => playTrack(track, validTracks));
        container.appendChild(card);
    });
}

function getArtworkUrl(track) {
    if (track.artwork_url) {
        return track.artwork_url.replace('-large', '-t300x300');
    }
    if (track.user && track.user.avatar_url) {
        return track.user.avatar_url.replace('-large', '-t300x300');
    }
    return null;
}

// ==================== PLAYER ====================
async function playTrack(track, playlist) {
    if (currentTrack && currentTrack.id === track.id) {
        togglePlay();
        return;
    }

    currentTrack = track;
    currentPlaylist = playlist || [track];
    currentIndex = currentPlaylist.findIndex(t => t.id === track.id);

    // Update UI
    updatePlayerUI(track);
    playerBar.classList.add('active');

    // Highlight active card
    document.querySelectorAll('.track-card').forEach(card => {
        card.classList.remove('playing');
    });
    document.querySelectorAll('.track-card').forEach(card => {
        const title = card.querySelector('.track-title');
        if (title && title.textContent === track.title) {
            card.classList.add('playing');
        }
    });

    // Show loading state on play button
    playIcon.classList.add('hidden');
    pauseIcon.classList.add('hidden');

    try {
        // Get the real stream URL via transcodings
        const streamUrl = await getStreamUrl(track.id);
        
        if (!streamUrl) {
            showToast('Música não disponível para reprodução.');
            updatePlayButton();
            return;
        }

        audioPlayer.src = streamUrl;
        await audioPlayer.play();
        isPlaying = true;
        updatePlayButton();
        playerArtwork.classList.add('playing-animation');
    } catch (error) {
        console.error('Playback error:', error);
        showToast('Erro ao reproduzir. Tente outra música.');
        updatePlayButton();
    }
}

function updatePlayerUI(track) {
    const artworkUrl = getArtworkUrl(track);
    
    if (artworkUrl) {
        playerArtwork.innerHTML = `<img src="${artworkUrl}" alt="${escapeHtml(track.title)}">`;
    } else {
        playerArtwork.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" opacity="0.5"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`;
    }

    playerTitle.textContent = track.title;
    playerArtist.textContent = track.user ? track.user.username : 'Desconhecido';
    
    // Update page title
    document.title = `${track.title} - SoundVibe`;
}

function togglePlay() {
    if (!currentTrack) return;

    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playerArtwork.classList.remove('playing-animation');
    } else {
        audioPlayer.play();
        isPlaying = true;
        playerArtwork.classList.add('playing-animation');
    }
    updatePlayButton();
}

function updatePlayButton() {
    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

function playPrevious() {
    if (currentPlaylist.length === 0) return;
    currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playTrack(currentPlaylist[currentIndex], currentPlaylist);
}

function playNext() {
    if (currentPlaylist.length === 0) return;
    currentIndex = (currentIndex + 1) % currentPlaylist.length;
    playTrack(currentPlaylist[currentIndex], currentPlaylist);
}

// ==================== PROGRESS ====================
function updateProgress() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
        progressKnob.style.left = `${progress}%`;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
}

function seekTo(e) {
    if (!audioPlayer.duration) return;
    const rect = progressBarContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

// ==================== VOLUME ====================
function changeVolume() {
    const value = volumeSlider.value;
    audioPlayer.volume = value / 100;
    isMuted = value === 0;
    updateVolumeIcon();
}

function toggleMute() {
    if (isMuted) {
        audioPlayer.volume = previousVolume / 100;
        volumeSlider.value = previousVolume;
        isMuted = false;
    } else {
        previousVolume = volumeSlider.value;
        audioPlayer.volume = 0;
        volumeSlider.value = 0;
        isMuted = true;
    }
    updateVolumeIcon();
}

function updateVolumeIcon() {
    if (isMuted || audioPlayer.volume === 0) {
        volumeIcon.classList.add('hidden');
        volumeMuteIcon.classList.remove('hidden');
    } else {
        volumeIcon.classList.remove('hidden');
        volumeMuteIcon.classList.add('hidden');
    }
}

// ==================== UTILITIES ====================
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}