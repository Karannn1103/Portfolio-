// Projects JavaScript for Portfolio Website

// Function to load projects from JSON data
const loadProjects = async () => {
    try {
        console.log('Loading projects data...');
        const response = await fetch('data/portfolio.json');
        if (!response.ok) {
            throw new Error('Could not load projects data');
        }
        
        const data = await response.json();
        console.log('Projects data loaded successfully:', data);
        
        if (data.projects && data.projects.length > 0) {
            const projectsGrid = document.getElementById('projects-grid');
            
            // Clear existing projects
            projectsGrid.innerHTML = '';
            
            // Add projects from data
            data.projects.forEach((project, index) => {
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item fade-in';
                projectItem.setAttribute('data-category', project.category || 'web');
                
                // Add animation delay based on index
                projectItem.style.animationDelay = `${0.2 + (index * 0.1)}s`;
                
                // Check if project has a gallery or single image
                const hasGallery = project.gallery && project.gallery.length > 0;
                const mainImage = hasGallery ? project.mainImage || project.gallery[0] : project.image || 'images/projects/default.jpg';
                
                console.log(`Project ${index} - ${project.title}:`, {
                    hasGallery,
                    mainImage,
                    gallery: project.gallery
                });
                
                // Create HTML structure based on whether project has gallery or not
                let projectHTML = `
                    <div class="project-image${hasGallery ? ' has-gallery' : ''}">
                        <img src="${mainImage}" alt="${project.title}" onerror="this.onerror=null; this.src='images/projects/default.jpg'; console.error('Failed to load image: ${mainImage}');">
                        ${hasGallery ? '<div class="gallery-indicator"><i class="fas fa-images"></i></div>' : ''}
                    </div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                `;
                
                // Add technologies if available
                if (project.technologies && project.technologies.length > 0) {
                    projectHTML += '<div class="project-technologies">';
                    project.technologies.forEach(tech => {
                        projectHTML += `<span class="tech-badge">${tech}</span>`;
                    });
                    projectHTML += '</div>';
                }
                
                // Add features if available
                if (project.features && project.features.length > 0) {
                    projectHTML += '<div class="project-features"><h4>Key Features:</h4><ul>';
                    project.features.forEach(feature => {
                        projectHTML += `<li>${feature}</li>`;
                    });
                    projectHTML += '</ul></div>';
                }
                
                // Add view project link
                projectHTML += `<a href="${project.link || '#'}" class="project-link hover-lift" target="_blank">View Project</a>`;
                
                // Add gallery button if available
                if (hasGallery) {
                    projectHTML += `<button class="btn btn-secondary view-gallery hover-lift" data-project="${index}">View Gallery</button>`;
                }
                
                projectHTML += '</div>';
                
                projectItem.innerHTML = projectHTML;
                projectsGrid.appendChild(projectItem);
                
                // Store gallery data as a data attribute if available
                if (hasGallery) {
                    projectItem.setAttribute('data-gallery', JSON.stringify(project.gallery));
                }
            });
            
            // Add hover effects and animations
            const projectItems = document.querySelectorAll('.project-item');
            projectItems.forEach(item => {
                // Add hover animation
                item.classList.add('hover-lift');
                
                // Add shine effect on hover
                const projectImage = item.querySelector('.project-image');
                if (projectImage) {
                    item.addEventListener('mouseenter', () => {
                        projectImage.classList.add('shine');
                    });
                    
                    item.addEventListener('mouseleave', () => {
                        projectImage.classList.remove('shine');
                    });
                }
                
                // Add gallery view functionality
                const galleryBtn = item.querySelector('.view-gallery');
                if (galleryBtn) {
                    galleryBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        openGallery(item);
                    });
                }
                
                // Make the project image also open the gallery if it has one
                const projectImageElement = item.querySelector('.project-image.has-gallery');
                if (projectImageElement) {
                    projectImageElement.addEventListener('click', () => {
                        openGallery(item);
                    });
                    projectImageElement.style.cursor = 'pointer';
                }
            });
            
            // Update filter buttons based on available categories
            updateFilterButtons(data.projects);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-grid').innerHTML = `
            <div class="error-message">
                <p>Failed to load projects. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
};

// Function to open gallery modal
const openGallery = (projectItem) => {
    try {
        // Get gallery data
        const galleryData = JSON.parse(projectItem.getAttribute('data-gallery') || '[]');
        console.log('Opening gallery with images:', galleryData);
        
        if (!galleryData.length) {
            console.error('No gallery images found');
            return;
        }
        
        // Create gallery modal
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        
        // Create gallery content
        let galleryHTML = `
            <div class="gallery-content">
                <button class="gallery-close"><i class="fas fa-times"></i></button>
                <div class="gallery-main">
                    <img src="${galleryData[0]}" alt="Gallery image" onerror="this.onerror=null; this.src='images/projects/default.jpg'; console.error('Failed to load gallery image: ${galleryData[0]}');">
                </div>
                <div class="gallery-nav">
                    <button class="gallery-prev"><i class="fas fa-chevron-left"></i></button>
                    <div class="gallery-thumbnails">
        `;
        
        // Add thumbnails
        galleryData.forEach((image, index) => {
            galleryHTML += `
                <div class="gallery-thumb${index === 0 ? ' active' : ''}" data-index="${index}">
                    <img src="${image}" alt="Thumbnail" onerror="this.onerror=null; this.src='images/projects/default.jpg'; console.error('Failed to load thumbnail: ${image}');">
                </div>
            `;
        });
        
        galleryHTML += `
                    </div>
                    <button class="gallery-next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;
        
        modal.innerHTML = galleryHTML;
        document.body.appendChild(modal);
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Add animation class
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Set up gallery functionality
        let currentIndex = 0;
        const mainImage = modal.querySelector('.gallery-main img');
        const thumbnails = modal.querySelectorAll('.gallery-thumb');
        const prevBtn = modal.querySelector('.gallery-prev');
        const nextBtn = modal.querySelector('.gallery-next');
        const closeBtn = modal.querySelector('.gallery-close');
        
        // Function to update active image
        const updateActiveImage = (index) => {
            currentIndex = index;
            mainImage.src = galleryData[index];
            
            // Update active thumbnail
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            thumbnails[index].classList.add('active');
        };
        
        // Add click events to thumbnails
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.getAttribute('data-index'));
                updateActiveImage(index);
            });
        });
        
        // Add click events to prev/next buttons
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
            updateActiveImage(newIndex);
        });
        
        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % galleryData.length;
            updateActiveImage(newIndex);
        });
        
        // Add keyboard navigation
        const handleKeydown = (e) => {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'Escape') {
                closeBtn.click();
            }
        };
        
        window.addEventListener('keydown', handleKeydown);
        
        // Close gallery
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
                window.removeEventListener('keydown', handleKeydown);
            }, 300);
        });
        
        // Close when clicking outside the content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
    } catch (error) {
        console.error('Error opening gallery:', error);
    }
};

// Function to update filter buttons based on available project categories
const updateFilterButtons = (projects) => {
    if (!projects || projects.length === 0) return;
    
    // Get unique categories
    const categories = ['all', ...new Set(projects.map(project => project.category || 'web'))];
    
    // Get filter container
    const filterContainer = document.querySelector('.projects-filter');
    if (!filterContainer) return;
    
    // Clear existing buttons
    filterContainer.innerHTML = '';
    
    // Add filter buttons
    categories.forEach((category, index) => {
        const button = document.createElement('button');
        button.className = category === 'all' ? 'filter-btn active hover-lift' : 'filter-btn hover-lift';
        button.setAttribute('data-filter', category);
        button.textContent = category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1);
        
        // Add animation delay
        button.style.animationDelay = `${0.1 * index}s`;
        button.classList.add('fade-in');
        
        // Add click event
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter projects with animation
            const projectItems = document.querySelectorAll('.project-item');
            projectItems.forEach((item, itemIndex) => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    // Show with animation
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 50 * itemIndex);
                } else {
                    // Hide with animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
        
        filterContainer.appendChild(button);
    });
};

// Projects handling script

document.addEventListener('DOMContentLoaded', function() {
    console.log("Projects script loaded");
    
    // Get all project elements
    const projectItems = document.querySelectorAll('.project-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Check if elements exist
    console.log(`Found ${projectItems.length} project items`);
    console.log(`Found ${filterButtons.length} filter buttons`);
    
    // Set up filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Log the filter being applied
            const filter = button.getAttribute('data-filter');
            console.log(`Applying filter: ${filter}`);
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show all projects if "all" filter is selected
            if (filter === 'all') {
                projectItems.forEach(item => {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 100);
                });
                return;
            }
            
            // Otherwise filter projects
            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 100);
                } else {
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Initialize project images with proper error handling
    projectItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            // Log image loading
            console.log(`Loading image: ${img.src}`);
            
            // Set up fallback if image fails to load
            img.onerror = function() {
                console.error(`Failed to load image: ${this.src}`);
                this.src = 'images/projects/default.jpg';
                this.classList.add('missing-project');
                
                // Make placeholder visible
                const placeholder = this.nextElementSibling;
                if (placeholder && placeholder.classList.contains('project-placeholder')) {
                    placeholder.style.opacity = '1';
                }
            };
            
            // Handle successful image load
            img.onload = function() {
                console.log(`Successfully loaded image: ${this.src}`);
                this.classList.remove('missing-project');
                
                // Hide placeholder
                const placeholder = this.nextElementSibling;
                if (placeholder && placeholder.classList.contains('project-placeholder')) {
                    placeholder.style.opacity = '0';
                }
            };
        }
    });
    
    // Add click handlers to open project details
    projectItems.forEach(item => {
        const link = item.querySelector('.project-link');
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get project information
                const title = item.querySelector('h3').textContent;
                const description = item.querySelector('p').textContent;
                const imageSrc = item.querySelector('img').src;
                
                console.log(`Opening project: ${title}`);
                
                // Here you could implement a modal to show project details
                // or navigate to a dedicated project page
                alert(`Project "${title}" details coming soon!\n\n${description}`);
            });
        }
    });
    
    // Make all projects visible on page load with a slight delay for animation
    setTimeout(() => {
        projectItems.forEach(item => {
            item.classList.add('visible');
        });
    }, 300);
});

// Function to handle project images
function handleProjectImages() {
    const projectImages = document.querySelectorAll('.project-image img');
    
    projectImages.forEach(img => {
        // Test if the image exists
        const testImage = new Image();
        testImage.src = img.src;
        
        testImage.onerror = function() {
            console.log('Project image not found:', img.src);
            img.classList.add('missing-project');
            
            // Try to create a canvas-based placeholder
            try {
                createProjectPlaceholder(img);
            } catch (e) {
                console.error('Failed to create project placeholder:', e);
            }
        };
    });
}

// Function to create a canvas-based project placeholder
function createProjectPlaceholder(imgElement) {
    // Only proceed if canvas is supported
    if (!document.createElement('canvas').getContext) {
        return;
    }
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 600;
    canvas.height = 400;
    
    // Get project title from alt text
    const title = imgElement.alt || 'Project';
    
    // Get project category
    const projectItem = imgElement.closest('.project-item');
    const category = projectItem ? projectItem.getAttribute('data-category') : 'web';
    
    // Set colors based on category
    let primaryColor, secondaryColor, iconText;
    
    switch(category) {
        case 'mobile':
            primaryColor = '#4cd964';
            secondaryColor = '#34c759';
            iconText = '📱';
            break;
        case 'network':
            primaryColor = '#0a84ff';
            secondaryColor = '#007aff';
            iconText = '🌐';
            break;
        case 'design':
            primaryColor = '#ff9500';
            secondaryColor = '#ff9f0a';
            iconText = '🎨';
            break;
        default: // web
            primaryColor = '#0071e3';
            secondaryColor = '#0058b0';
            iconText = '💻';
    }
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f5f5f7');
    gradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw decorative elements
    ctx.fillStyle = primaryColor + '20'; // 20% opacity
    ctx.beginPath();
    ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 100, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = secondaryColor + '15'; // 15% opacity
    ctx.beginPath();
    ctx.arc(canvas.width * 0.2, canvas.height * 0.8, 120, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw project icon
    ctx.font = '80px Arial';
    ctx.fillStyle = primaryColor;
    ctx.textAlign = 'center';
    ctx.fillText(iconText, canvas.width / 2, canvas.height / 2 - 20);
    
    // Draw project title
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#1d1d1f';
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 + 60);
    
    // Draw category text
    ctx.font = '20px Arial';
    ctx.fillStyle = primaryColor;
    ctx.fillText(category.charAt(0).toUpperCase() + category.slice(1) + ' Development', canvas.width / 2, canvas.height / 2 + 100);
    
    // Convert canvas to data URL and set as image source
    try {
        const dataUrl = canvas.toDataURL('image/png');
        imgElement.src = dataUrl;
        imgElement.classList.remove('missing-project');
    } catch (e) {
        console.error('Failed to convert canvas to data URL:', e);
    }
}

// Function to setup project icons based on category
function setupProjectIcons() {
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const placeholder = item.querySelector('.project-placeholder');
        
        if (!placeholder) return;
        
        const icon = placeholder.querySelector('i');
        if (!icon) return;
        
        // Update icon based on category
        switch(category) {
            case 'mobile':
                icon.className = 'fas fa-mobile-alt';
                break;
            case 'network':
                icon.className = 'fas fa-network-wired';
                break;
            case 'design':
                icon.className = 'fas fa-paint-brush';
                break;
            case 'web':
                icon.className = 'fas fa-globe';
                break;
            default:
                icon.className = 'fas fa-code';
        }
    });
}

// Call the function to load projects
loadProjects(); 