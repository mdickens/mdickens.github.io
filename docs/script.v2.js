document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    console.log("DOMContentLoaded fired.");
    console.log("Hamburger element:", hamburger);
    console.log("Mobile menu element:", mobileMenu);

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            console.log("Hamburger clicked! Toggling menu state.");
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            // Optional: Prevent body scrolling when menu is open
            // This is useful if your menu is full-screen overlay
            if (mobileMenu.classList.contains('active')) {
                body.style.overflowY = 'hidden'; // Disable scroll on body
            } else {
                body.style.overflowY = ''; // Enable scroll on body
            }
        });

    } else {
        console.error("ERROR: Could not find hamburger or mobile menu elements. Check IDs/classes in HTML.");
    }

    let lastScrollTop = 0; // Stores the last scroll position

    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        console.log("Window scroll event triggered! Current scroll:", currentScrollTop);

        // Only act if the menu is active
        if (mobileMenu.classList.contains('active')) {
            // Check if user is scrolling significantly (prevents accidental closes from minor scrolls)
            // Use Math.abs for scrolling in either direction
            if (Math.abs(currentScrollTop - lastScrollTop) > 20) { // Increased threshold for "significant" scroll
                console.log("Significant scroll detected. Closing menu.");
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                body.style.overflowY = ''; // Re-enable body scroll
            }
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    });

    // Optional: Close menu if a menu item is clicked
    mobileMenu.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function() {
            console.log("Menu item clicked. Closing menu.");
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            body.style.overflowY = ''; // Re-enable body scroll
        });
    });
});
