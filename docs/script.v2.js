document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu'); // Get menu by ID
    const body = document.body; // Reference the body for scroll handling

    // Toggle menu and hamburger icon
    hamburger.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        // Optional: Prevent body scrolling when menu is open
        // body.style.overflowY = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // --- NEW: Close menu on scroll ---
    let lastScrollTop = 0; // Stores the last scroll position

    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Only act if the menu is active
        if (mobileMenu.classList.contains('active')) {
            // Check if user is scrolling DOWN significantly (prevents accidental closes from minor scrolls)
            if (currentScrollTop > lastScrollTop + 10 || currentScrollTop < lastScrollTop - 10) {
                 // If scrolling has occurred, close the menu
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                // Optional: Restore body scroll if you prevented it earlier
                // body.style.overflowY = '';
            }
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
    });

    // Optional: Close menu if a menu item is clicked
    mobileMenu.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            // body.style.overflowY = '';
        });
    });
});
