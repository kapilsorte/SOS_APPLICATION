// Object to store previous values in case of empty saves
let previousValues = {};

/**
 * Handles the back button click in the header
 */
function goBack() {
    // This guarantees it will always navigate to the Dashboard
    window.location.href = '../pages/Dashboard.html'; 
}

/**
 * Toggles a medical field between a read-only span and an editable textarea.
 * Generates and updates a real-time character counter.
 */
function toggleEdit(btnElement, fieldId) {
    const field = document.getElementById(fieldId);
    const isEditing = field.tagName === 'TEXTAREA';

    if (isEditing) {
        // --- SAVE MODE ---
        let newValue = field.value.trim();
        const originalValue = previousValues[fieldId];
        
        // Revert Check: If user deleted everything, restore previous value
        if (newValue === '') {
            newValue = originalValue;
        } 
        
        // Convert Textarea back to Span
        const span = document.createElement('span');
        span.id = fieldId;
        span.className = 'value';
        span.innerText = newValue; 
        
        // Find and remove the character counter element
        const counter = document.getElementById(fieldId + '-counter');
        if (counter) {
            counter.remove();
        }

        field.replaceWith(span);
        
        // Change icon back to Edit (Square Pen)
        btnElement.innerHTML = '<i class="far fa-edit"></i>';
        btnElement.style.color = 'var(--text-secondary)';
    } else {
        // --- EDIT MODE ---
        const currentValue = field.innerText;
        previousValues[fieldId] = currentValue; 
        
        // Convert Span to Textarea 
        const textarea = document.createElement('textarea');
        textarea.id = fieldId;
        textarea.className = 'edit-input';
        textarea.value = currentValue;
        textarea.maxLength = 200; 
        textarea.rows = 3; 
        
        // Create Character Counter Element
        const counter = document.createElement('div');
        counter.id = fieldId + '-counter';
        counter.className = 'char-counter';
        counter.innerText = `${currentValue.length}/200 characters`;
        
        field.replaceWith(textarea);
        
        // Insert the counter immediately after the new textarea
        const newField = document.getElementById(fieldId);
        newField.parentNode.insertBefore(counter, newField.nextSibling);
        
        // Live update the counter as the user types
        newField.addEventListener('input', function() {
            counter.innerText = `${this.value.length}/200 characters`;
        });
        
        // Auto-focus the new input and place cursor at the end
        newField.focus();
        newField.setSelectionRange(newField.value.length, newField.value.length);
        
        // Change icon to Save (Checkmark)
        btnElement.innerHTML = '<i class="fas fa-check"></i>';
        btnElement.style.color = 'var(--accent-red)';
    }
}