// Mobile Menu Toggle
function toggleMenu() {
  const navList = document.getElementById('nav-list');
  if (navList) {
    navList.classList.toggle('open');
  }
}

// Interactive Audio Player with Continuous Play & In-line Master Controls

document.addEventListener('DOMContentLoaded', () => {
  // 1. Run your theme engine first
  applyRandomPalette();

  // 2. Cache DOM elements and state variables
  const audioPlayer = document.getElementById('audio-player');
  const masterPlayBtn = document.getElementById('master-play-btn');
  const songItems = document.querySelectorAll('.song-item');
  const progressBar = document.getElementById('song-progress');
  const volumeSlider = document.getElementById('volume-slider');
  
  let currentPlayingIndex = 0;
  let pendingSeekPercent = null;

  // SVG Icons
  const playIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
  const pauseIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;

  if (!audioPlayer) return; // Exit safely if not on the project detail page

  // 3. Helper: Update badge icons across all tracks
  function updateActiveBadge(activeIndex, iconHtml) {
    songItems.forEach((sItem, sIdx) => {
      const btn = sItem.querySelector('.song-badge');
      if (btn) {
        btn.innerHTML = (sIdx === activeIndex) ? iconHtml : playIcon;
      }
    });
  }

  // 4. Helper: Load and play track cleanly
function loadAndPlayTrack(index) {
    currentPlayingIndex = index;
    const item = songItems[index];

    if (progressBar) {
      progressBar.value = 0;
    }

    audioPlayer.src = item.getAttribute('data-src');
    audioPlayer.currentTime = 0;

    // Ensure the volume matches the slider position before playback starts
    if (volumeSlider) {
      audioPlayer.volume = parseFloat(volumeSlider.value);
    }

    audioPlayer.play();

    if (masterPlayBtn) masterPlayBtn.innerHTML = pauseIcon;
    updateActiveBadge(index, pauseIcon);
  }

  // 5. Track Item Click Listeners
  songItems.forEach((item, index) => {
    const badgeBtn = item.querySelector('.song-badge');
    
    if (badgeBtn) {
      badgeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (currentPlayingIndex === index && !audioPlayer.paused) {
          audioPlayer.pause();
          if (masterPlayBtn) masterPlayBtn.innerHTML = playIcon;
          badgeBtn.innerHTML = playIcon;
        } 
        else if (currentPlayingIndex === index && audioPlayer.paused && audioPlayer.src && audioPlayer.src !== "") {
          audioPlayer.play();
          if (masterPlayBtn) masterPlayBtn.innerHTML = pauseIcon;
          badgeBtn.innerHTML = pauseIcon;
        } 
        else {
          loadAndPlayTrack(index);
        }
      });
    }
  });

  // 6. Master Play Button
  if (masterPlayBtn) {
    masterPlayBtn.addEventListener('click', () => {
      if (audioPlayer.paused) {
        if (audioPlayer.src === "" && songItems.length > 0) {
          loadAndPlayTrack(0);
        } else {
          audioPlayer.play();
          masterPlayBtn.innerHTML = pauseIcon;
          updateActiveBadge(currentPlayingIndex, pauseIcon);
        }
      } else {
        audioPlayer.pause();
        masterPlayBtn.innerHTML = playIcon;
        updateActiveBadge(currentPlayingIndex, playIcon);
      }
    });
  }

  // 7. Progress Bar & Scrubbing
  if (progressBar) {
    progressBar.addEventListener('input', (e) => {
      if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
        audioPlayer.currentTime = (e.target.value / 100) * audioPlayer.duration;
        pendingSeekPercent = null;
      } else {
        pendingSeekPercent = parseFloat(e.target.value);
      }
    });
  }

audioPlayer.addEventListener('loadedmetadata', () => {
    if (pendingSeekPercent !== null && audioPlayer.duration) {
      audioPlayer.currentTime = (pendingSeekPercent / 100) * audioPlayer.duration;
      pendingSeekPercent = null;
    }
    
    // Set total track duration text when loaded
    if (totalTimeEl && audioPlayer.duration) {
      totalTimeEl.textContent = formatTime(audioPlayer.duration);
    }
  });

const currentTimeEl = document.getElementById('current-time'); // Make sure this ID matches your HTML
  const totalTimeEl = document.getElementById('total-time');     // Make sure this ID matches your HTML

  audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration && progressBar) {
      progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    }
    
    // Update elapsed time text
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
  });
  
  // Reset buttons and icons when the track finishes playing naturally
  audioPlayer.addEventListener('ended', () => {
    if (masterPlayBtn) masterPlayBtn.innerHTML = playIcon;
    
    // Reset all track badges back to the play icon
    songItems.forEach((item) => {
      const btn = item.querySelector('.song-badge');
      if (btn) btn.innerHTML = playIcon;
    });

    // Optional: Reset progress bar back to 0
    if (progressBar) progressBar.value = 0;
  });

  // 8. Volume Slider
if (volumeSlider) {
    // Match initial audio volume to the slider's starting position
    audioPlayer.volume = parseFloat(volumeSlider.value);

    volumeSlider.addEventListener('input', (e) => {
      audioPlayer.volume = parseFloat(e.target.value);
    });
  }
  
  // Helper: Format seconds into m:ss
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
});


// Photobook Sidebar Dropdown Toggle
function togglePhotobookMenu() {
  const sidebar = document.querySelector('.photobook-sidebar');
  if (sidebar) {
    sidebar.classList.toggle('dropdown-open');
  }
}

function closePhotobookMenu() {
  const sidebar = document.querySelector('.photobook-sidebar');
  if (sidebar) {
    sidebar.classList.remove('dropdown-open');
  }
}


// Close photobook dropdown when clicking outside of it
document.addEventListener('click', (event) => {
  const sidebar = document.querySelector('.photobook-sidebar');
  if (sidebar && sidebar.classList.contains('dropdown-open')) {
    // Check if the click occurred outside the photobook sidebar
    if (!sidebar.contains(event.target)) {
      sidebar.classList.remove('dropdown-open');
    }
  }
});

// --- 1. Random Color Palettes on Load/Refresh ---
const palettes = [
  {
	 /*GAMECUBE*/
    bg: '#F1EEF9',
	hoverText: '#F1EEF9',
	card:'#D9D5E7', 
	header:'#D9D5E7',
	nested:'#C9C3D9',
    border: '#8A81A4',
	hoverBg: '#423A52',
	texts: '#0A0315'
  },
  { /*BASE COLOUR - IGNORE THAT ITS 2ND*/
    /*BEIGES*/
	bg: '#FEF4E9',
	hoverText: '#FEF4E9',
	card:'#f1e2cf', 
	header:'#f1e2cf',
	nested:'#E3D3BE',
    border: '#B09A7F',
	hoverBg: '#59453b',
	texts: '#220A00'
  },
  {
	  
	  /*REDS*/
    bg: '#FFEEEB',
	hoverText: '#FFEEEB',
	card:'#F2D7D0', 
	header:'#F2D7D0',
	nested:'#E3C6BF',
    border: '#B0887F',
	hoverBg: '#593B3C',
	texts: '#210002'
  },
  {
	  /*GREYSCALE*/
    bg: '#F2F2F2',
	hoverText: '#F2F2F2',
	card:'#E0E0E0', 
	header:'#E0E0E0',
	nested:'#D1D1D1',
    border: '#969696',
	hoverBg: '#4A4A4A',
	texts: '#121212'
  },
  {
	  /*SPICE ORANGE*/
    bg: '#FFF4EB',
	hoverText: '#FFF4EB',
	card:'#F5E1CC', 
	header:'#F5E1CC',
	nested:'#EAD0B8',
    border: '#C49569',
	hoverBg: '#683D2C',
	texts: '#1F0800'
  }
];

function applyRandomPalette() {
  const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
  const root = document.documentElement;

  root.style.setProperty('--bg-color', randomPalette.bg);
  root.style.setProperty('--text-color', randomPalette.texts);
  root.style.setProperty('--border-color', randomPalette.border);
  root.style.setProperty('--hover-bg', randomPalette.hoverBg);
  root.style.setProperty('--hover-text', randomPalette.hoverText);
  root.style.setProperty('--card-bg-color', randomPalette.card);
  root.style.setProperty('--header-bg-color', randomPalette.header);
  root.style.setProperty('--nested-div-bg-color', randomPalette.nested);
}

// Apply palette on page load
applyRandomPalette();


// --- Project Tag Filtering Logic ---

document.addEventListener('DOMContentLoaded', () => {
  const tagButtons = document.querySelectorAll('.tag-btn');
  const projectCards = document.querySelectorAll('.proj-grid-container .card');

  function filterCards() {
    // Get all currently active tags
    const activeButtons = document.querySelectorAll('.tag-btn.active');
    const activeTags = Array.from(activeButtons).map(btn => btn.getAttribute('data-tag'));

    projectCards.forEach(card => {
      const cardTags = card.getAttribute('data-tags') || '';
      
      // Show card if no tags are active, OR if it matches at least one active tag
      const shouldShow = activeTags.length === 0 || activeTags.some(tag => cardTags.includes(tag));

      card.style.display = shouldShow ? '' : 'none';
    });
  }

  if (tagButtons.length > 0 && projectCards.length > 0) {
    tagButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Simply toggle this button's active state independently
        button.classList.toggle('active');

        // Run the filtering check
        filterCards();
      });
    });

    // Initial filter run on page load (since all are active by default)
    filterCards();
  }
});

