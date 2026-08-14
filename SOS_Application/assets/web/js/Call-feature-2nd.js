let timerInterval;
let totalSeconds = 0;

document.addEventListener("DOMContentLoaded", () => {
    loadCallDetails();
    startTimer();
});

/**
 * Loads caller information from LocalStorage
 */
function loadCallDetails() {
    const savedName = localStorage.getItem('fakeCall_name') || 'Unknown';
    const savedNumber = localStorage.getItem('fakeCall_number') || '+91 98765 43210';
    const savedPhoto = localStorage.getItem('fakeCall_photo');

    // Set Text Details
    document.getElementById('callerNameDisplay').textContent = savedName;
    document.getElementById('callerNumberDisplay').textContent = savedNumber;

    // Handle Photo vs Initial
    const imgElement = document.getElementById('callerImage');
    const initialElement = document.getElementById('callerInitial');

    if (savedPhoto && savedPhoto.trim() !== '') {
        imgElement.src = savedPhoto;
        imgElement.style.display = 'block';
        initialElement.style.display = 'none';
    } else {
        const firstLetter = savedName.charAt(0).toUpperCase();
        initialElement.textContent = firstLetter;
        initialElement.style.display = 'flex';
        imgElement.style.display = 'none';
    }
}

/**
 * Starts the ongoing call timer (MM:SS format)
 */
function startTimer() {
    const timerDisplay = document.getElementById('callTimer');
    
    timerInterval = setInterval(() => {
        totalSeconds++;
        
        // Calculate minutes and seconds
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        
        // Add leading zeros if needed
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

/**
 * Toggles the visual 'active' state of control buttons (e.g., Mute, Speaker)
 */
function toggleBtn(buttonElement) {
    buttonElement.classList.toggle('active');
}

/**
 * Ends the call and redirects back to the dashboard/setup
 */
function endCall() {
    clearInterval(timerInterval);
    // Replace 'index.html' with the actual filename of your dashboard/menu page
    window.location.href = '../index.html'; 
}