document.addEventListener("DOMContentLoaded", () => {
    loadLocations();
});

/**
 * Toggles the input field between Edit Mode (Pen) and Save Mode (Tick).
 * Implements validation when attempting to save the inline input.
 */
function toggleEdit(inputId, btnId) {
    const inputElement = document.getElementById(inputId);
    const btnElement = document.getElementById(btnId);
    
    // Find the parent wrapper to apply error styles
    const inputBox = inputElement.closest('.location-input-box');

    // If input is currently editable, user clicked the TICK to save
    if (!inputElement.hasAttribute('readonly')) {
        const val = inputElement.value.trim();
        
        // Validation: Cannot be empty and must be at least 3 characters
        if (val.length < 3) {
            inputBox.classList.add('error');
            alert("Please enter a valid, complete location address.");
            inputElement.focus();
            return;
        }
        
        // Validation Passed -> Lock the field
        inputBox.classList.remove('error');
        inputElement.setAttribute('readonly', 'true');
        
        // Change icon back to Pen
        btnElement.innerHTML = '<i class="fas fa-pen"></i>';
        btnElement.classList.remove('btn-saving');
        
    } else {
        // If input is readonly, user clicked the PEN to edit (Search Mode)
        inputElement.removeAttribute('readonly');
        inputElement.focus();
        
        // Move cursor to the end of the text
        const currentVal = inputElement.value;
        inputElement.value = '';
        inputElement.value = currentVal;
        
        // Change icon to a Checkmark (Tick)
        btnElement.innerHTML = '<i class="fas fa-check"></i>';
        btnElement.classList.add('btn-saving');
    }
}

/**
 * Placeholder for launching the Maps API integration
 * @param {string} inputId - The ID of the input field to populate from the map
 */
function openMapPicker(inputId) {
    // In a real application, this would open a Google Maps modal
    // or trigger the Google Places Autocomplete API dropdown.
    alert("Maps API integration will open here to allow picking a location visually.");
    
    // Example: If they pick a location from the map, you can programmatically 
    // update the input and ensure it's locked back to read-only.
    /*
        document.getElementById(inputId).value = "Selected Map Location, City";
        document.getElementById(inputId).setAttribute('readonly', 'true');
        // Reset the corresponding edit button if it was active
    */
}

/**
 * Validates the inputs and saves them globally to LocalStorage
 */
function saveLocations() {
    const homeInput = document.getElementById('homeAddress');
    const workInput = document.getElementById('workAddress');
    
    const homeVal = homeInput.value.trim();
    const workVal = workInput.value.trim();

    // Check if any edit buttons are currently open (in save state)
    const activeEdits = document.querySelectorAll('.edit-btn.btn-saving');
    if (activeEdits.length > 0) {
        alert("Please confirm your location edits by clicking the checkmark before saving.");
        return;
    }
    
    let isValid = true;

    if (homeVal.length < 3) {
        homeInput.closest('.location-input-box').classList.add('error');
        isValid = false;
    }

    if (workVal.length < 3) {
        workInput.closest('.location-input-box').classList.add('error');
        isValid = false;
    }

    if (!isValid) {
        alert("Please provide valid addresses for both home and work locations.");
        return;
    }

    // Save to local storage for persistence across pages
    localStorage.setItem('emergency_homeLocation', homeVal);
    localStorage.setItem('emergency_workLocation', workVal);
    
    alert("Important locations saved successfully!");
}

/**
 * Loads previously saved locations from LocalStorage
 */
function loadLocations() {
    const savedHome = localStorage.getItem('emergency_homeLocation');
    const savedWork = localStorage.getItem('emergency_workLocation');

    if (savedHome) {
        document.getElementById('homeAddress').value = savedHome;
    }

    if (savedWork) {
        document.getElementById('workAddress').value = savedWork;
    }
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