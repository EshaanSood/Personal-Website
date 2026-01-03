/**
 * Albums Page - Search, Filter, Scores, and Dynamic Rendering
 */

(function() {
    'use strict';

    let albumsData = [];
    let filteredAlbums = [];

    const elements = {
        searchInput: document.getElementById('album-search'),
        genreFilter: document.getElementById('genre-filter'),
        sortSelect: document.getElementById('sort-select'),
        albumsList: document.getElementById('albums-list'),
        albumsEmpty: document.getElementById('albums-empty'),
        albumsCount: document.getElementById('albums-count-text')
    };

    async function fetchAlbums() {
        try {
            const response = await fetch('data/albums.json');
            if (!response.ok) throw new Error('Failed to load albums');
            albumsData = await response.json();
            filteredAlbums = [...albumsData];
            populateGenreFilter();
            sortAndRenderAlbums();
        } catch (error) {
            console.error('Error:', error);
            elements.albumsCount.textContent = 'Error loading albums.';
        }
    }

    function populateGenreFilter() {
        const genres = [...new Set(albumsData.map(a => a.genre))].sort();
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            elements.genreFilter.appendChild(option);
        });
    }

    function createScoreDisplay(score) {
        const scoreClass = score >= 9 ? 'score-high' : score >= 7 ? 'score-mid' : 'score-low';
        return `<div class="album-score ${scoreClass}">
            <span class="score-value">${score}</span>
            <span class="score-max">/10</span>
        </div>`;
    }

    function createAlbumCard(album, index) {
        const card = document.createElement('article');
        card.className = 'album-card';
        card.setAttribute('role', 'listitem');

        card.innerHTML = `
            <div class="album-info">
                <h3 class="album-title">${escapeHtml(album.title)}</h3>
                <p class="album-artist">${escapeHtml(album.artist)}</p>
                <div class="album-meta">
                    <span class="album-year">${album.year}</span>
                    <span class="album-genre">${escapeHtml(album.genre)}</span>
                </div>
            </div>
            ${createScoreDisplay(album.score)}
            ${album.note ? `<p class="album-note">"${escapeHtml(album.note)}"</p>` : ''}
        `;

        // Staggered animation
        const delay = Math.min(index * 0.05, 0.5);
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, delay * 1000);

        return card;
    }

    function sortAndRenderAlbums() {
        const sortBy = elements.sortSelect?.value || 'score';
        
        filteredAlbums.sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return b.score - a.score || a.title.localeCompare(b.title);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'artist':
                    return a.artist.localeCompare(b.artist);
                case 'year':
                    return b.year - a.year;
                default:
                    return 0;
            }
        });

        renderAlbums();
    }

    function renderAlbums() {
        elements.albumsList.innerHTML = '';
        
        const count = filteredAlbums.length;
        const total = albumsData.length;
        elements.albumsCount.textContent = count === total 
            ? `Showing all ${total} albums` 
            : `Showing ${count} of ${total} albums`;

        if (count === 0) {
            elements.albumsEmpty.hidden = false;
            elements.albumsList.hidden = true;
        } else {
            elements.albumsEmpty.hidden = true;
            elements.albumsList.hidden = false;

            filteredAlbums.forEach((album, index) => {
                elements.albumsList.appendChild(createAlbumCard(album, index));
            });
        }
    }

    function filterAlbums() {
        const query = elements.searchInput.value.toLowerCase().trim();
        const genre = elements.genreFilter.value;

        filteredAlbums = albumsData.filter(album => {
            const matchesSearch = !query || 
                album.title.toLowerCase().includes(query) ||
                album.artist.toLowerCase().includes(query);
            const matchesGenre = !genre || album.genre === genre;
            return matchesSearch && matchesGenre;
        });

        sortAndRenderAlbums();

        // Highlight active filters
        elements.genreFilter.style.borderColor = genre ? 'var(--color-purple)' : '';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    function init() {
        if (!elements.albumsList) return;
        
        elements.searchInput?.addEventListener('input', debounce(filterAlbums, 200));
        elements.genreFilter?.addEventListener('change', filterAlbums);
        elements.sortSelect?.addEventListener('change', sortAndRenderAlbums);
        elements.searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                elements.searchInput.value = '';
                filterAlbums();
            }
        });

        fetchAlbums();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
