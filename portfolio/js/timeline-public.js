// Public Timeline JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load timeline posts
    loadPublicTimeline();
});

// Load Timeline Posts from localStorage
function loadPublicTimeline() {
    const timelineContainer = document.getElementById('publicTimeline');
    const loadingElement = document.querySelector('.loading');
    const emptyElement = document.querySelector('.timeline-empty');
    
    if (!timelineContainer) return;
    
    // Get posts from localStorage
    const posts = JSON.parse(localStorage.getItem('timelinePosts') || '[]');
    
    // Hide loading after a brief delay (for visual effect)
    setTimeout(() => {
        loadingElement.style.display = 'none';
        
        if (posts.length === 0) {
            // Show empty state
            emptyElement.style.display = 'block';
            return;
        }
        
        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Generate HTML for each post
        const postsHTML = posts.map(post => {
            return `
                <div class="timeline-post">
                    <div class="timeline-post-content">
                        ${post.image && post.image !== 'data:,' ? 
                            `<img src="${post.image}" alt="${post.title}" class="timeline-post-image">` : ''}
                        <h3 class="timeline-post-title">${post.title}</h3>
                        <div class="timeline-post-date">
                            <i class="far fa-calendar-alt"></i>
                            ${formatDate(post.date)}
                        </div>
                        <div class="timeline-post-category ${post.category}">
                            ${formatCategory(post.category)}
                        </div>
                        <p class="timeline-post-description">${post.description}</p>
                        ${post.link ? 
                            `<a href="${post.link}" target="_blank" class="timeline-post-link">
                                View Details <i class="fas fa-external-link-alt"></i>
                            </a>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add posts to the container
        timelineContainer.innerHTML = postsHTML;
        
        // Apply animations with staggered delay
        const timelinePosts = document.querySelectorAll('.timeline-post');
        timelinePosts.forEach((post, index) => {
            setTimeout(() => {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, 150 * index);
        });
    }, 800);
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Format category for display
function formatCategory(category) {
    if (!category) return 'Uncategorized';
    
    const categories = {
        'achievement': 'Achievement',
        'learning': 'Learning',
        'project': 'Project',
        'certification': 'Certification'
    };
    
    return categories[category] || category.charAt(0).toUpperCase() + category.slice(1);
} 