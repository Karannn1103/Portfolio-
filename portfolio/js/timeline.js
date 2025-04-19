// Timeline JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadTimelinePosts();
});

// Load Timeline Posts
function loadTimelinePosts() {
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    const posts = JSON.parse(localStorage.getItem('timelinePosts') || '[]');
    
    // Sort posts by date in descending order
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    timelineContainer.innerHTML = posts.map(post => `
        <div class="timeline-post">
            <div class="timeline-post-content">
                <div class="timeline-post-date">${formatDate(post.date)}</div>
                <div class="timeline-post-category">${formatCategory(post.category)}</div>
                <h3 class="timeline-post-title">${post.title}</h3>
                ${post.image ? `<img src="${post.image}" alt="${post.title}" class="timeline-post-image">` : ''}
                <p class="timeline-post-description">${post.description}</p>
                ${post.link ? `<a href="${post.link}" target="_blank" class="timeline-post-link">View Project</a>` : ''}
            </div>
        </div>
    `).join('');
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format Category
function formatCategory(category) {
    const categories = {
        achievement: 'Achievement',
        learning: 'Learning',
        project: 'Project',
        certification: 'Certification'
    };
    return categories[category] || category;
} 