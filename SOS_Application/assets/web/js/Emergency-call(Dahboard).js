document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    setupCharacterCounter();
    setupPhotoUpload();
    setupPhotoModal();
});

/**
 * Handle Character Counting for the Name field
 */
function setupCharacterCounter() {
    const nameInput = document.getElementById('callerName');
    const nameCounter = document.getElementById('nameCounter');

    nameInput.addEventListener('input', function() {
        nameCounter.textContent = this.value.length;
        this.classList.remove('error'); // Remove error outline on typing
    });
}

/**
 * Handle Gender Selection UI toggle
 */
let selectedGender = "Female"; // Default matching the UI image

function selectGender(gender) {
    selectedGender = gender;
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.gender-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    const activeBtn = document.querySelector(`.gender-btn[data-gender="${gender}"]`);
    if(activeBtn) {
        activeBtn.classList.add('active');
    }
}

/**
 * Handle Profile Photo Upload via FileReader
 */
function setupPhotoUpload() {
    const photoUpload = document.getElementById('photoUpload');
    const photoPreview = document.getElementById('callerPhotoPreview');

    photoUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            // Optional: check file size (e.g. limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result;
                // Temporarily store in session/local storage for preview (Not ideal for large base64 strings in prod, but fine for prototype)
                localStorage.setItem('fakeCall_photo', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });
}

/**
 * Photo Enlargement Modal Logic
 */
function setupPhotoModal() {
    const modal = document.getElementById("imageModal");
    const img = document.getElementById("callerPhotoPreview");
    const modalImg = document.getElementById("enlargedImg");

    img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
    }

    // Close when clicking outside the image
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

/**
 * Validate inputs and permanently save to LocalStorage
 */
function saveSettings() {
    const nameInput = document.getElementById('callerName');
    const numberInput = document.getElementById('callerNumber');
    
    const nameVal = nameInput.value.trim();
    const numberVal = numberInput.value.trim();
    
    let isValid = true;

    // 1. Validate Name
    if (nameVal === '') {
        nameInput.classList.add('error');
        isValid = false;
    }

    // 2. Validate Number (Basic check for presence and digits)
    if (numberVal === '' || !/^[\d\+\s\-\(\)]+$/.test(numberVal)) {
        numberInput.classList.add('error');
        isValid = false;
    } else {
        numberInput.classList.remove('error');
    }

    if (!isValid) {
        alert("Please fill in the required fields correctly.");
        return;
    }

    // 3. Save permanently to Local Storage
    localStorage.setItem('fakeCall_name', nameVal);
    localStorage.setItem('fakeCall_number', numberVal);
    localStorage.setItem('fakeCall_gender', selectedGender);
    
    // Photo is already saved onChange, but we can ensure the UI responds
    alert("Changes saved successfully!");
}

/**
 * Load settings from LocalStorage when page opens
 */
function loadSettings() {
    const savedName = localStorage.getItem('fakeCall_name');
    const savedNumber = localStorage.getItem('fakeCall_number');
    const savedGender = localStorage.getItem('fakeCall_gender');
    const savedPhoto = localStorage.getItem('fakeCall_photo');

    if (savedName) {
        const nameInput = document.getElementById('callerName');
        nameInput.value = savedName;
        document.getElementById('nameCounter').textContent = savedName.length;
    }
    
    if (savedNumber) {
        document.getElementById('callerNumber').value = savedNumber;
    }

    if (savedGender) {
        selectGender(savedGender);
    }

    if (savedPhoto) {
        document.getElementById('callerPhotoPreview').src = savedPhoto;
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