document.addEventListener("DOMContentLoaded", () => {
    // SOS Button interaction
    const sosBtn = document.getElementById('sosBtn');
    
    sosBtn.addEventListener('touchstart', () => {
        sosBtn.style.transform = 'scale(0.9)';
    });

    sosBtn.addEventListener('touchend', () => {
        sosBtn.style.transform = 'scale(1)';
    });

    // Swipe bar interaction
    const swipeBar = document.getElementById('swipeBar');
    
    swipeBar.addEventListener('click', () => {
        swipeBar.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            swipeBar.style.transform = 'translateY(0)';
        }, 200);
        
        console.log("Emergency options requested.");
    });

    // Prevent default touch moves globally to stop mobile browser bouncing
    document.addEventListener('touchmove', function(e) {
        // Only prevent if touching outside scrollable areas (if any are added later)
        if(e.target.closest('.content-scroll') == null) {
            e.preventDefault();
        }
    }, { passive: false });

    // Navbar Buttons interaction logging
    const navButtons = document.querySelectorAll('.action-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find the span text within the clicked button to identify it
            const btnName = btn.querySelector('span').innerText;
            console.log(`${btnName} button clicked!`);
        });
    });
});