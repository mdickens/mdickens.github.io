document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobileMenu'); // Get menu by ID
    const body = document.body; // Reference the body for scroll handling

	console.log("DOMContentLoaded fired."); // Check if the event listener itself is working
   	console.log("Hamburger element:", hamburger); // Check if hamburger is found
   	console.log("Mobile menu element:", mobileMenu); // Check if mobileMenu is found

	// Only proceed if elements are found
    if (hamburger && mobileMenu) {
    	// Toggle menu and hamburger icon
    	hamburger.addEventListener('click', function() {
			console.log("Hamburger clicked!"); // Check if click event fires
        	mobileMenu.classList.toggle('active');
        	hamburger.classList.toggle('active');
        	// Optional: Prevent body scrolling when menu is open
        	// body.style.overflowY = mobileMenu.classList.contains('active') ? 'hidden' : '';
    	});
		// Attach scroll listener
        hamburger.addEventListener('scroll', function() {
            console.log("Window scrolled!"); // THIS IS THE KEY TEST: does this message appear?
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (mobileMenu.classList.contains('active')) {
                // ... (your scroll-to-close logic) ...
				console.log("Hamburger scrolled!"); // Check if click event fires
            	mobileMenu.classList.remove('active');
            	hamburger.classList.remove('active');
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        });

	    hamburger.addEventListener('scroll', function() {
			console.log("Hamburger scrolled!"); // Check if click event fires
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
		});
    } else {
        console.error("ERROR: Could not find hamburger or mobile menu elements. Check IDs/classes in HTML.");
    }

    // --- NEW: Close menu on scroll ---
    let lastScrollTop = 0; // Stores the last scroll position

    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

		console.log("window.addEventListener triggered!"); // Check if click event fires
        // Only act if the menu is active
        if (mobileMenu.classList.contains('active')) {
            // Check if user is scrolling DOWN significantly (prevents accidental closes from minor scrolls)
            if (currentScrollTop > lastScrollTop + 10 || currentScrollTop < lastScrollTop - 10) {
                 // If scrolling has occurred, close the menu
				console.log("Remove menu due to scroll!"); // Check if click event fires
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                // Optional: Restore body scroll if you prevented it earlier
                // body.style.overflowY = '';
            }
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
    });

	const scrollableContainer = document.getElementById('body');
	if (scrollableContainer) {
    	scrollableContainer.addEventListener('scroll', function() {
        console.log("Inner container scrolled!");
        // Your scroll logic here
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
    	});
	}

    // Optional: Close menu if a menu item is clicked
    mobileMenu.querySelectorAll('a').forEach(item => {
        item.addEventListener('click', function() {
			console.log("item.addEventListene triggered!"); // Check if click event fires
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            // body.style.overflowY = '';
        });
    });
});
