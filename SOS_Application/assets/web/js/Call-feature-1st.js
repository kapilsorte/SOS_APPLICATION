document.addEventListener("DOMContentLoaded", () => {
    loadIncomingCallDetails();
});

function loadIncomingCallDetails() {
    // 1. Retrieve data saved from the previous setup screen
    const savedName = localStorage.getItem('fakeCall_name') || 'Unknown';
    const savedPhoto = localStorage.getItem('fakeCall_photo'); // Base64 image or null

    // 2. Set the caller name on the screen
    document.getElementById('callerNameDisplay').textContent = savedName;

    // 3. Handle the avatar logic (Photo vs Initial)
    const imgElement = document.getElementById('callerImage');
    const initialElement = document.getElementById('callerInitial');

    if (savedPhoto && savedPhoto.trim() !== '') {
        // A photo exists: display the image, hide the initial
        imgElement.src = savedPhoto;
        imgElement.style.display = 'block';
        initialElement.style.display = 'none';
    } else {
        // No photo exists: extract the first letter, display the initial, hide the image
        const firstLetter = savedName.charAt(0).toUpperCase();
        initialElement.textContent = firstLetter;
        initialElement.style.display = 'flex';
        imgElement.style.display = 'none';
    }
}

/**
 * Handle Decline Call
 */
function endCall() {
    // Stops the call and returns to the dashboard setup
    window.location.href = '../index.html'; // Change this to your main dashboard filename
}

/**
 * Handle Accept Call
 */
function acceptCall() {
    // Optional: Redirect to an active call screen if you build one
    alert("Call Accepted!");
    window.location.href = '../index.html'; 
}