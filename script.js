class RazuvaevTV {
    constructor() {
        this.currentTab = 'on-repeat';
        this.currentTrackIndex = 0;
        this.playlist = [];
        this.isPlaying = false;
        this.init();
    }

    async init() {
        await this.loadPlaylist();
        this.setupEventListeners();
        this.loadTrack();
    }

    async loadPlaylist() {
        try {
            const response = await fetch('playlist.json');
            if (response.ok) {
                this.playlist = await response.json();
            } else {
                console.error('Failed to load playlist');
            }
        } catch (error) {
            console.error('Error loading playlist:', error);
            this.showNoContent();
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        document.querySelectorAll('.prev-btn').forEach(btn => {
            btn.addEventListener('click', () => this.previousTrack());
        });

        document.querySelectorAll('.play-pause-btn').forEach(btn => {
            btn.addEventListener('click', () => this.togglePlayPause());
        });

        document.querySelectorAll('.next-btn').forEach(btn => {
            btn.addEventListener('click', () => this.nextTrack());
        });
    }

    getActiveSection() {
        return document.querySelector(`#${this.currentTab}`);
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tab);
        });

        this.currentTrackIndex = 0;
        this.loadTrack();
    }

    loadTrack() {
        if (this.playlist.length === 0) {
            this.showNoContent();
            return;
        }

        const track = this.playlist[this.currentTrackIndex];
        const section = this.getActiveSection();
        
        this.updateTrackInfo(section, track);
        this.updatePlayerState(section);
        this.loadYouTubeVideo(section, track.videoId);
    }

    updateTrackInfo(section, track) {
        const trackName = section.querySelector('.track-name');
        const albumName = section.querySelector('.album-name');
        const artistName = section.querySelector('.artist-name');
        const albumArt = section.querySelector('.album-art');

        if (trackName) trackName.textContent = track.title || 'Unknown Track';
        if (albumName) albumName.textContent = track.album || 'Unknown Album';
        if (artistName) artistName.textContent = track.artist || 'Unknown Artist';
        if (albumArt) albumArt.src = track.thumbnail || '';

        const spotifyLink = section.querySelector('.music-link.spotify');
        const appleLink = section.querySelector('.music-link.apple');
        const yandexLink = section.querySelector('.music-link.yandex');

        if (spotifyLink) spotifyLink.href = track.spotify || '#';
        if (appleLink) appleLink.href = track.appleMusic || '#';
        if (yandexLink) yandexLink.href = track.yandexMusic || '#';
    }

    showPlayerView(section, viewName) {
        section.querySelectorAll('.player-view').forEach(view => {
            view.classList.toggle('active', view.dataset.view === viewName);
        });
    }

    loadYouTubeVideo(section, videoId) {
        const overlay = section.querySelector('.player-overlay');
        const iframe = section.querySelector('.youtube-iframe');
        
        if (overlay) {
            overlay.classList.add('loading');
        }
        
        this.showPlayerView(section, 'overlay');

        setTimeout(() => {
            if (iframe) {
                iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
            }
            this.showPlayerView(section, 'youtube');
            if (overlay) {
                overlay.classList.remove('loading');
            }
        }, 1000);
    }

    updatePlayerState(section) {
        const playPauseBtn = section.querySelector('.play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.textContent = this.isPlaying ? '❚❚' : '▶';
        }

        const prevBtn = section.querySelector('.prev-btn');
        const nextBtn = section.querySelector('.next-btn');
        
        if (prevBtn) prevBtn.disabled = this.currentTrackIndex === 0;
        if (nextBtn) nextBtn.disabled = this.currentTrackIndex === this.playlist.length - 1;
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        const section = this.getActiveSection();
        this.updatePlayerState(section);
        console.log('Play/Pause:', this.isPlaying);
    }

    previousTrack() {
        if (this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
            this.loadTrack();
        }
    }

    nextTrack() {
        if (this.currentTrackIndex < this.playlist.length - 1) {
            this.currentTrackIndex++;
            this.loadTrack();
        }
    }

    showNoContent() {
        const section = this.getActiveSection();
        this.showPlayerView(section, 'no-content');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RazuvaevTV();
});
