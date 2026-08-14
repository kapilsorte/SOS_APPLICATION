/**
 * Navigation fallback
 */
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'Dashboard.html'; 
    }
}

/**
 * Toggles a contact card between read-only spans and editable inputs.
 * Implements strict validation on save.
 */
function toggleContactEdit(cardId, btnElement) {
    const card = document.getElementById(`card-${cardId}`);
    if (!card) return;
    
    const values = card.querySelectorAll('.value');
    
    // Check if the card is currently in editing state
    const isEditing = values[0].tagName === 'INPUT';

    if (isEditing) {
        // --- ATTEMPT TO SAVE INLINE ---
        let isValid = true;
        const newValues = [];

        // Validate each input inside the current card
        values.forEach(input => {
            const val = input.value.trim();
            input.classList.remove('input-error'); // Reset previous errors

            if (val === '') {
                isValid = false;
                input.classList.add('input-error');
            } else if (input.type === 'tel') {
                // Phone validation: Must contain at least 10 digits
                const digitCount = val.replace(/\D/g, '').length;
                if (digitCount < 10) {
                    isValid = false;
                    input.classList.add('input-error');
                } else {
                    newValues.push(val);
                }
            } else {
                newValues.push(val);
            }
        });

        if (!isValid) {
            alert("Please fill out all required fields. Phone numbers must contain at least 10 digits.");
            return; // Stop execution if validation fails
        }

        // Convert inputs back to spans if validation passes
        values.forEach((input, index) => {
            const span = document.createElement('span');
            span.className = 'value';
            span.id = input.id;
            span.innerText = newValues[index]; 
            input.replaceWith(span);
        });

        // Reset Button UI
        btnElement.innerHTML = '<i class="fas fa-pen"></i> Edit';
        btnElement.classList.remove('btn-saving');

    } else {
        // --- ENTER EDIT MODE ---
        values.forEach(span => {
            const currentValue = span.innerText;
            const input = document.createElement('input');
            
            input.className = 'value edit-input';
            input.id = span.id;
            input.value = currentValue;
            
            // Set input type appropriately
            if (span.id.includes('phone')) {
                input.type = 'tel';
            } else {
                input.type = 'text';
            }
            
            span.replaceWith(input);
        });

        // Focus the first input (Name) automatically
        card.querySelector('input').focus();

        // Update Button UI to indicate save action
        btnElement.innerHTML = '<i class="fas fa-check"></i> Save';
        btnElement.classList.add('btn-saving');
    }
}

/**
 * Handles deleting a specific contact card
 */
function deleteContact(cardId) {
    if(confirm("Are you sure you want to delete this emergency contact?")) {
        const card = document.getElementById(`card-${cardId}`);
        if (card) {
            // Apply fade out effect
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                card.remove();
            }, 300);
        }
    }
}

/**
 * Handles the global Save Changes action at the bottom of the screen.
 */
function saveAllChanges() {
    // Check if any card is currently still in edit mode (has open inputs)
    const activeEdits = document.querySelectorAll('.edit-btn.btn-saving');
    
    if (activeEdits.length > 0) {
        alert("Please confirm your edits by clicking 'Save' on the active contact cards before saving all changes.");
        return;
    }

    alert("Emergency contacts updated successfully!");
    
    // Optional: Redirect back to main dashboard after saving
    // window.location.href = 'Dashboard.html';
}