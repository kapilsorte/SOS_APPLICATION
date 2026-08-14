let contactIdCounter = 3; // To keep track of unique IDs for new contacts

// Run on page load to set button state initially
document.addEventListener('DOMContentLoaded', updateAddButtonVisibility);

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
 * Checks how many contacts exist and toggles the Add Contact button
 */
function updateAddButtonVisibility() {
    const currentContacts = document.querySelectorAll('.contact-card').length;
    const addBtn = document.getElementById('add-contact-btn');
    
    if (currentContacts < 3) {
        addBtn.style.display = 'flex';
    } else {
        addBtn.style.display = 'none';
    }
}

/**
 * Re-numbers the remaining contacts to maintain a clean 1, 2, 3 sequence
 */
function updateContactNumbers() {
    const cards = document.querySelectorAll('.contact-card');
    cards.forEach((card, index) => {
        const numBadge = card.querySelector('.contact-number');
        const title = card.querySelector('.header-left h2');
        if(numBadge) numBadge.innerText = index + 1;
        if(title) title.innerText = `Emergency Contact ${index + 1}`;
    });
}

/**
 * Generates and injects a new contact card into the DOM
 */
function addNewContact() {
    const currentContacts = document.querySelectorAll('.contact-card').length;
    if (currentContacts >= 3) return; // Failsafe limit

    contactIdCounter++; // Increment unique ID
    const newId = contactIdCounter;
    
    const cardHTML = `
        <div class="card-header">
            <div class="header-left">
                <div class="contact-number">${currentContacts + 1}</div>
                <h2>Emergency Contact ${currentContacts + 1}</h2>
            </div>
            <div class="header-actions">
                <button class="edit-btn btn-saving" onclick="toggleContactEdit(${newId}, this)">
                    <i class="fas fa-check"></i> Save
                </button>
                <button class="delete-btn" onclick="deleteContact(${newId})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        
        <div class="card-body">
            <div class="detail-row">
                <div class="row-icon"><i class="far fa-user"></i></div>
                <div class="row-content">
                    <label>Name <span class="req">*</span></label>
                    <input type="text" class="value edit-input" id="val-name-${newId}" placeholder="Enter Name">
                </div>
            </div>
            <div class="detail-row">
                <div class="row-icon"><i class="fas fa-phone-alt"></i></div>
                <div class="row-content">
                    <label>Phone Number <span class="req">*</span></label>
                    <input type="tel" class="value edit-input" id="val-phone-${newId}" placeholder="Enter Phone Number">
                </div>
            </div>
            <div class="detail-row">
                <div class="row-icon"><i class="fas fa-user-friends"></i></div>
                <div class="row-content">
                    <label>Relation <span class="req">*</span></label>
                    <input type="text" class="value edit-input" id="val-relation-${newId}" placeholder="Enter Relation">
                </div>
            </div>
        </div>
    `;

    const newCard = document.createElement('div');
    newCard.className = 'contact-card glass-panel';
    newCard.id = `card-${newId}`;
    newCard.innerHTML = cardHTML;

    // Insert just before the add button
    const container = document.getElementById('contacts-container');
    const addButton = document.getElementById('add-contact-btn');
    container.insertBefore(newCard, addButton);

    // Update UI state
    updateAddButtonVisibility();
    updateContactNumbers();
    
    // Focus the first input of the new card
    newCard.querySelector('input').focus();
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
                updateAddButtonVisibility();
                updateContactNumbers();
            }, 300);
        }
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

        values.forEach(input => {
            const val = input.value.trim();
            input.classList.remove('input-error'); 

            if (val === '') {
                isValid = false;
                input.classList.add('input-error');
            } else if (input.type === 'tel') {
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
            return; 
        }

        values.forEach((input, index) => {
            const span = document.createElement('span');
            span.className = 'value';
            span.id = input.id;
            span.innerText = newValues[index]; 
            input.replaceWith(span);
        });

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
            
            if (span.id.includes('phone')) {
                input.type = 'tel';
            } else {
                input.type = 'text';
            }
            
            span.replaceWith(input);
        });

        card.querySelector('input').focus();
        btnElement.innerHTML = '<i class="fas fa-check"></i> Save';
        btnElement.classList.add('btn-saving');
    }
}

/**
 * Handles the global Save Changes action at the bottom of the screen.
 */
function saveAllChanges() {
    const activeEdits = document.querySelectorAll('.edit-btn.btn-saving');
    
    if (activeEdits.length > 0) {
        alert("Please confirm your edits by clicking 'Save' on the active contact cards before saving all changes.");
        return;
    }

    alert("Emergency contacts updated successfully!");
    // window.location.href = 'Dashboard.html';
}