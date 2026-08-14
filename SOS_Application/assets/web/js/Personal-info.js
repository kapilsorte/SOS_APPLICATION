// Object to keep track of the values before editing begins
let previousValues = {};

/**
 * Toggles a field between a read-only span and an editable input/select.
 * Implements validation and empty state reversion.
 */
function toggleEdit(btnElement, fieldId) {
    const field = document.getElementById(fieldId);
    const isEditing = field.tagName === 'INPUT' || field.tagName === 'SELECT';

    if (isEditing) {
        // --- Save Mode Triggered ---
        let newValue = field.value.trim();
        const originalValue = previousValues[fieldId];
        
        // 1. Revert Check: If user deleted everything, restore previous value
        if (newValue === '') {
            newValue = originalValue;
        } 
        else {
            // 2. Phone Validation: Exact 10 Digits
            if (fieldId === 'val-phone') {
                const isOnlyDigits = /^\d{10}$/.test(newValue);
                
                if (!isOnlyDigits) {
                    alert("Phone number must contain exactly 10 digits and only numbers.");
                    field.focus(); // Keep focus on input so they can fix it
                    return; // Prevent saving
                }
            }
        }
        
        // Convert Input/Select back to Span securely
        const span = document.createElement('span');
        span.id = fieldId;
        span.className = 'value';
        span.innerText = newValue; 
        
        field.replaceWith(span);
        
        // Update Icon to Edit (Pen)
        btnElement.innerHTML = '<i class="far fa-edit"></i>';
        btnElement.style.color = 'var(--text-secondary)';
    } else {
        // --- Edit Mode Triggered ---
        const currentValue = field.innerText;
        previousValues[fieldId] = currentValue; // Store for fallback
        
        if (fieldId === 'val-gender') {
            // Create a dropdown for Gender
            const select = document.createElement('select');
            select.id = fieldId;
            select.className = 'edit-input edit-select';
            
            const options = ['Male', 'Female', 'Other', 'Prefer not to say'];
            options.forEach(opt => {
                const optionElement = document.createElement('option');
                optionElement.value = opt;
                optionElement.innerText = opt;
                if (opt === currentValue) {
                    optionElement.selected = true;
                }
                select.appendChild(optionElement);
            });
            
            field.replaceWith(select);
            document.getElementById(fieldId).focus();
            
        } else {
            // Create standard text/tel input for Name and Phone
            const input = document.createElement('input');
            input.id = fieldId;
            input.type = fieldId === 'val-phone' ? 'tel' : 'text'; 
            input.className = 'edit-input';
            
            // Clean out spaces if editing a phone number for 10-digit validation
            if (fieldId === 'val-phone') {
                input.value = currentValue.replace(/\D/g, '').slice(-10);
            } else {
                input.value = currentValue;
            }
            
            field.replaceWith(input);
            document.getElementById(fieldId).focus();
        }
        
        // Update Icon to Save (Checkmark)
        btnElement.innerHTML = '<i class="fas fa-check"></i>';
        btnElement.style.color = 'var(--accent-red)';
    }
}

/**
 * Handles the newly selected file when clicking "Edit" on profile
 */
function updateProfilePhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImage').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

/** 
 * Modal Logic for Photo Enlargement
 */
const modal = document.getElementById("imageModal");
const profileImg = document.getElementById("profileImage");
const modalImg = document.getElementById("enlargedImg");

// Open modal when photo is clicked
profileImg.onclick = function() {
    modal.style.display = "block";
    modalImg.src = this.src;
}

// Close modal function
function closeModal() {
    modal.style.display = "none";
}

// Close modal when clicking outside the enlarged image
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}