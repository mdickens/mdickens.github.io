// Function to initialize Google Analytics
function initializeGoogleAnalytics() {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'G-X3T91JZH6W');
}

// Function to handle dark mode toggling and preference saving
function setupDarkMode() {
  const toggleButton = document.getElementById('mode-toggle');
  const body = document.body;
  const darkClass = 'dark-mode';
  console.log('setupDarkMode')

  // Load saved preference on page load
  if (localStorage.getItem('mode') === darkClass) {
    console.log('mode===darkClass')
    body.classList.add(darkClass);
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const isDarkMode = body.classList.toggle(darkClass);
      console.log('click event toggleButton.addEventListener')
      if (isDarkMode) {
	console.log('set darkmode')
        localStorage.setItem('mode', darkClass);
      } else {
	console.log('clear darkmode')
        localStorage.removeItem('mode');
      }
    });
  }
}

// Function to handle mobile menu functionality
function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const body = document.body;

  if (!hamburger || !mobileMenu) {
    console.error("ERROR: Could not find hamburger or mobile menu elements.");
    return;
  }

  const toggleMenu = () => {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    body.style.overflowY = mobileMenu.classList.contains('active') ? 'hidden' : '';
  };

  const closeMenu = () => {
    if (mobileMenu.classList.contains('active')) {
      toggleMenu();
    }
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close menu on menu item click (for better UX)
  mobileMenu.querySelectorAll('a').forEach(item => {
    item.addEventListener('click', closeMenu);
  });
  
  // Close menu on significant scroll
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(currentScrollTop - lastScrollTop) > 20) {
      closeMenu();
    }
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  });
}

// Function to handle video play/pause logic
function setupVideoPlayers() {
  document.querySelectorAll('.video-container').forEach(container => {
    const video = container.querySelector('video');
    const playButton = container.querySelector('.play-button');

    if (!video || !playButton) {
      console.error('ERROR: Video or play button not found in a video container.');
      return;
    }

    const togglePlayButton = (isVisible) => {
      playButton.style.display = isVisible ? 'flex' : 'none';
    };

    const handleVideoClick = () => {
      video.paused ? video.play() : video.pause();
    };

    // Initial state
    togglePlayButton(video.paused);

    // Event listeners
    playButton.addEventListener('click', () => video.play());
    video.addEventListener('click', handleVideoClick);
    video.addEventListener('play', () => togglePlayButton(false));
    video.addEventListener('pause', () => togglePlayButton(true));

    // Intersection Observer to pause video when out of view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
        }
      });
    }, {
      threshold: 0.5
    });
    observer.observe(video);
  });
}

// Run all initialization functions when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeGoogleAnalytics();
  setupDarkMode();
  setupMobileMenu();
  setupVideoPlayers();
});
