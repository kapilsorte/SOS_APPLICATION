document.addEventListener("DOMContentLoaded", () => {
    initBottomSheet();
});

/**
 * Handles the logic for dragging the bottom sheet up and down
 */
function initBottomSheet() {
    const sheet = document.getElementById('bottomSheet');
    const dragArea = document.getElementById('dragArea');
    
    let startY = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;

    // Detect when touch begins on the drag area
    dragArea.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
        
        // Remove smooth transition while finger is dragging so it follows instantly
        sheet.style.transition = 'none';
    });

    // Detect movement
    dragArea.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;
        
        // Calculate new position
        let newTranslate = prevTranslate + deltaY;
        
        // Prevent dragging it higher than its maximum open height
        if (newTranslate < 0) {
            newTranslate = 0;
        }
        
        currentTranslate = newTranslate;
        sheet.style.transform = `translateY(${currentTranslate}px)`;
    });

    // Detect when touch ends and snap to position
    dragArea.addEventListener('touchend', () => {
        isDragging = false;
        
        // Turn smooth transition back on for the snap animation
        sheet.style.transition = 'transform 0.3s ease-out';
        
        const sheetHeight = sheet.getBoundingClientRect().height;
        // Require user to drag at least 25% of the way down to snap it closed
        const threshold = sheetHeight * 0.25; 
        
        if (currentTranslate > threshold) {
            // Snap closed: Push it down, leaving 60px peeking at the bottom
            currentTranslate = sheetHeight - 60; 
        } else {
            // Snap open: Return to top
            currentTranslate = 0;
        }
        
        sheet.style.transform = `translateY(${currentTranslate}px)`;
        
        // Save state for the next drag
        prevTranslate = currentTranslate;
    });
}

/**
 * Navigation fallback
 */
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html'; 
    }
}

/**
 * Handles the "Send Request" button toggle
 * @param {HTMLElement} btn - The button element clicked
 */
function toggleRequest(btn) {
    if (btn.classList.contains('requested')) {
        btn.classList.remove('requested');
        btn.innerText = 'Send Request';
    } else {
        btn.classList.add('requested');
        btn.innerText = 'Requested';
        
        if(navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
}