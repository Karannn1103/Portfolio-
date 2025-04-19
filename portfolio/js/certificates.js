// Certificate handling script

document.addEventListener('DOMContentLoaded', function() {
    // Handle certificate images
    handleCertificateImages();
    
    // Setup certificate links
    setupCertificateLinks();
    
    // Setup certificate image clicks for lightbox
    setupCertificateImageClicks();
});

// Function to handle certificate images
function handleCertificateImages() {
    const certificateImages = document.querySelectorAll('.certificate-image img');
    
    certificateImages.forEach(img => {
        // Test if the image exists
        const testImage = new Image();
        testImage.src = img.src;
        
        testImage.onerror = function() {
            console.log('Certificate image not found:', img.src);
            img.classList.add('missing-certificate');
            
            // Try to create a canvas-based placeholder
            try {
                createCertificatePlaceholder(img);
            } catch (e) {
                console.error('Failed to create certificate placeholder:', e);
            }
        };
    });
}

// Function to create a canvas-based certificate placeholder
function createCertificatePlaceholder(imgElement) {
    // Only proceed if canvas is supported
    if (!document.createElement('canvas').getContext) {
        return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 300;
    
    // Get certificate title from alt text
    const title = imgElement.alt || 'Certificate';
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f5f5f7');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw border
    ctx.strokeStyle = '#0071e3';
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Draw certificate icon
    ctx.font = '60px FontAwesome, Arial';
    ctx.fillStyle = '#0071e3';
    ctx.textAlign = 'center';
    ctx.fillText('🏆', canvas.width / 2, 100);
    
    // Draw certificate title
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#1d1d1f';
    ctx.fillText(title, canvas.width / 2, 160);
    
    // Draw "Certificate of Achievement" text
    ctx.font = '18px Arial';
    ctx.fillStyle = '#86868b';
    ctx.fillText('Certificate of Achievement', canvas.width / 2, 200);
    
    // Convert canvas to data URL and set as image source
    try {
        const dataUrl = canvas.toDataURL('image/png');
        imgElement.src = dataUrl;
        imgElement.classList.remove('missing-certificate');
    } catch (e) {
        console.error('Failed to convert canvas to data URL:', e);
    }
}

// Function to setup certificate links
function setupCertificateLinks() {
    const certificateLinks = document.querySelectorAll('.certificate-link');
    
    certificateLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If the link is just "#" (placeholder), prevent default behavior
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                
                // Get certificate information
                const certificateItem = link.closest('.certificate-item');
                const title = certificateItem.querySelector('h3').textContent;
                const issuer = certificateItem.querySelector('.certificate-issuer').textContent;
                const date = certificateItem.querySelector('.certificate-date').textContent;
                
                // Show a modal with certificate information
                showCertificateModal(title, issuer, date);
            } else {
                // If it's a real certificate, show it in a lightbox instead of opening in new tab
                e.preventDefault();
                const imageUrl = link.getAttribute('href');
                const certificateItem = link.closest('.certificate-item');
                const title = certificateItem.querySelector('h3').textContent;
                
                showCertificateLightbox(imageUrl, title);
            }
        });
    });
}

// Function to setup certificate image clicks
function setupCertificateImageClicks() {
    const certificateImages = document.querySelectorAll('.certificate-image img:not(.missing-certificate)');
    
    certificateImages.forEach(img => {
        img.addEventListener('click', function() {
            // Get the certificate link URL
            const certificateItem = img.closest('.certificate-item');
            const link = certificateItem.querySelector('.certificate-link');
            
            if (link && link.getAttribute('href') !== '#') {
                const imageUrl = link.getAttribute('href');
                const title = certificateItem.querySelector('h3').textContent;
                
                showCertificateLightbox(imageUrl, title);
            }
        });
        
        // Add pointer cursor to indicate it's clickable
        img.style.cursor = 'pointer';
    });
}

// Function to show certificate modal
function showCertificateModal(title, issuer, date) {
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="certificate-modal-content">
            <div class="certificate-modal-header">
                <h3>Certificate Information</h3>
                <button class="certificate-modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="certificate-modal-body">
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Issuer:</strong> ${issuer}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p>This certificate is currently not available for viewing. Please check back later or contact for more information.</p>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Add animation class
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Setup close button
    const closeBtn = modal.querySelector('.certificate-modal-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }, 300);
    });
    
    // Close when clicking outside content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function escapeClose(e) {
        if (e.key === 'Escape') {
            closeBtn.click();
            document.removeEventListener('keydown', escapeClose);
        }
    });
}

// Function to show certificate lightbox
function showCertificateLightbox(imageUrl, title) {
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'certificate-lightbox';
    
    // Create lightbox content
    lightbox.innerHTML = `
        <div class="certificate-lightbox-content">
            <button class="certificate-lightbox-close"><i class="fas fa-times"></i></button>
            <div class="certificate-lightbox-image">
                <img src="${imageUrl}" alt="${title}" />
            </div>
            <div class="certificate-lightbox-title">
                <h3>${title}</h3>
            </div>
            <div class="certificate-lightbox-controls">
                <button class="certificate-lightbox-zoom-in"><i class="fas fa-search-plus"></i></button>
                <button class="certificate-lightbox-zoom-out"><i class="fas fa-search-minus"></i></button>
                <a href="${imageUrl}" download class="certificate-lightbox-download"><i class="fas fa-download"></i></a>
            </div>
        </div>
    `;
    
    // Add lightbox to body
    document.body.appendChild(lightbox);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Add animation class
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
    
    // Setup close button
    const closeBtn = lightbox.querySelector('.certificate-lightbox-close');
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        }, 300);
    });
    
    // Close when clicking outside content
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeBtn.click();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function escapeClose(e) {
        if (e.key === 'Escape') {
            closeBtn.click();
            document.removeEventListener('keydown', escapeClose);
        }
    });
    
    // Setup zoom controls
    const image = lightbox.querySelector('.certificate-lightbox-image img');
    let scale = 1;
    
    const zoomIn = lightbox.querySelector('.certificate-lightbox-zoom-in');
    const zoomOut = lightbox.querySelector('.certificate-lightbox-zoom-out');
    
    zoomIn.addEventListener('click', () => {
        scale += 0.1;
        if (scale > 3) scale = 3; // Max zoom
        image.style.transform = `scale(${scale})`;
    });
    
    zoomOut.addEventListener('click', () => {
        scale -= 0.1;
        if (scale < 0.5) scale = 0.5; // Min zoom
        image.style.transform = `scale(${scale})`;
    });
} 