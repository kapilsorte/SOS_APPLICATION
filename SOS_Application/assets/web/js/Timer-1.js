let countdownInterval;

document.addEventListener("DOMContentLoaded", () => {
    populateTimePickers();
});

/**
 * Dynamically populates the Hours, Minutes, and Seconds dropdowns
 */
function populateTimePickers() {
    const hoursSelect = document.getElementById('hoursSelect');
    const minutesSelect = document.getElementById('minutesSelect');
    const secondsSelect = document.getElementById('secondsSelect');

    for (let i = 0; i <= 23; i++) {
        let val = i < 10 ? `0${i}` : i;
        hoursSelect.add(new Option(val, val));
    }
    hoursSelect.value = "01";

    for (let i = 0; i <= 59; i++) {
        let val = i < 10 ? `0${i}` : i;
        minutesSelect.add(new Option(val, val));
        secondsSelect.add(new Option(val, val));
    }
}

/**
 * Toggles the input field between Edit Mode (Pen) and Save Mode (Tick).
 */
function toggleEdit(inputId, btnId) {
    const inputElement = document.getElementById(inputId);
    const btnElement = document.getElementById(btnId);
    const inputBox = inputElement.closest('.location-input-box');

    if (!inputElement.hasAttribute('readonly')) {
        const val = inputElement.value.trim();
        
        if (val.length < 3) {
            inputBox.classList.add('error');
            alert("Please enter a valid location address.");
            inputElement.focus();
            return;
        }
        
        inputBox.classList.remove('error');
        inputElement.setAttribute('readonly', 'true');
        btnElement.innerHTML = '<i class="fas fa-pen"></i>';
        btnElement.classList.remove('btn-saving');
        
    } else {
        inputElement.removeAttribute('readonly');
        inputElement.focus();
        
        const currentVal = inputElement.value;
        inputElement.value = '';
        inputElement.value = currentVal;
        
        btnElement.innerHTML = '<i class="fas fa-check"></i>';
        btnElement.classList.add('btn-saving');
    }
}

/**
 * Clears the input field when the 'x' button is clicked
 */
function clearInput(inputId, btnId) {
    const inputElement = document.getElementById(inputId);
    
    if (inputElement) {
        inputElement.value = '';
        inputElement.closest('.location-input-box').classList.remove('error');
        
        if (inputElement.hasAttribute('readonly')) {
            toggleEdit(inputId, btnId);
        } else {
            inputElement.focus();
        }
    }
}

/**
 * Validates data, hides the pickers, and starts the countdown
 */
function startTimer() {
    const hours = document.getElementById('hoursSelect').value;
    const minutes = document.getElementById('minutesSelect').value;
    const seconds = document.getElementById('secondsSelect').value;
    
    const source = document.getElementById('sourceInput').value.trim();
    const dest = document.getElementById('destInput').value.trim();
    
    const activeEdits = document.querySelectorAll('.edit-btn.btn-saving');
    if (activeEdits.length > 0) {
        alert("Please confirm your location edits by clicking the checkmark before starting the timer.");
        return;
    }

    if (source.length < 3 || dest.length < 3) {
        alert("Please provide both starting and destination locations.");
        return;
    }

    if (hours === "00" && minutes === "00" && seconds === "00") {
        alert("Please select a timer duration greater than 0.");
        return;
    }

    // Convert string time to total seconds
    let totalSeconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(seconds);

    // Swap UI to active timer mode
    document.getElementById('timeSetup').style.display = 'none';
    document.getElementById('timerBanner').style.display = 'none';
    
    document.getElementById('timerCardTitle').innerHTML = 'Timer Active <span class="req">●</span>';
    document.getElementById('timerCardSub').innerText = 'Emergency contacts will be alerted if not stopped.';
    
    const timerDisplay = document.getElementById('activeTimerDisplay');
    timerDisplay.style.display = 'block';

    // Lock location inputs completely
    document.querySelectorAll('.edit-btn').forEach(btn => btn.style.display = 'none');
    document.querySelectorAll('.clear-btn').forEach(btn => btn.style.display = 'none');

    // Change action button to Stop
    const actionBtn = document.getElementById('actionBtn');
    actionBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Timer';
    actionBtn.className = 'btn-start-timer btn-stop-timer'; // Add outline styling
    actionBtn.onclick = stopTimer; // Change function bound to click

    updateTimerText(totalSeconds, timerDisplay);

    // Start interval
    countdownInterval = setInterval(() => {
        totalSeconds--;
        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            timerDisplay.textContent = "00:00:00";
            alert("Timer Expired! Alerting your emergency contacts now.");
            stopTimer(); // Reset UI when finished
        } else {
            updateTimerText(totalSeconds, timerDisplay);
        }
    }, 1000);
}

/**
 * Formats seconds into HH:MM:SS
 */
function updateTimerText(totalSeconds, displayElement) {
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;

    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    displayElement.textContent = `${h}:${m}:${s}`;
}

/**
 * Halts the timer and restores the setup UI
 */
function stopTimer() {
    clearInterval(countdownInterval);

    // Restore Setup UI
    document.getElementById('timeSetup').style.display = 'flex';
    document.getElementById('timerBanner').style.display = 'flex';
    
    document.getElementById('timerCardTitle').innerHTML = 'Set Timer Duration <span class="req">*</span>';
    document.getElementById('timerCardSub').innerText = 'Set how much time you expect for this journey';
    
    document.getElementById('activeTimerDisplay').style.display = 'none';

    // Restore location inputs
    document.querySelectorAll('.edit-btn').forEach(btn => btn.style.display = 'flex');
    document.querySelectorAll('.clear-btn').forEach(btn => btn.style.display = 'block');

    // Restore action button
    const actionBtn = document.getElementById('actionBtn');
    actionBtn.innerHTML = '<i class="fas fa-play"></i> Start Timer';
    actionBtn.className = 'btn-start-timer';
    actionBtn.onclick = startTimer;
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