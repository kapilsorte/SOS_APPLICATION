document.addEventListener("DOMContentLoaded", () => {
    
    // --- Image Upload Logic ---
    const editBtn = document.getElementById('editAvatarBtn');
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');
    const enlargedImage = document.getElementById('enlargedImage');

    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            imageUpload.click();
        });
    }

    if (imageUpload) {
        imageUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                    enlargedImage.src = e.target.result;
                }
                
                reader.readAsDataURL(file);
            }
        });
    }

    // --- Image Enlargement Modal Logic ---
    const imageModal = document.getElementById('imageModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (profileImage && imageModal) {
        profileImage.addEventListener('click', () => {
            imageModal.classList.add('active');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            imageModal.classList.remove('active');
        });
    }

    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                imageModal.classList.remove('active');
            }
        });
    }

    // --- Card Click Interactions ---
    const menuCards = document.querySelectorAll('.menu-card');
    
    menuCards.forEach(card => {
        card.addEventListener('click', function() {
            const sectionName = this.querySelector('h3').innerText;
            console.log(`Navigating to: ${sectionName}`);
        });
    });
});