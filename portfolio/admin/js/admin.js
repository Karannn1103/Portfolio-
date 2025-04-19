// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = checkLoginStatus();
    const currentPage = window.location.pathname;

    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && !currentPage.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    // If logged in and on login page, redirect to dashboard
    if (isLoggedIn && currentPage.includes('login.html')) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize admin panel functionality
    if (currentPage.includes('index.html')) {
        initializeAdminPanel();
    }
});

// Check Login Status
function checkLoginStatus() {
    const loginTime = localStorage.getItem('adminLoginTime');
    if (!loginTime) return false;

    const currentTime = new Date().getTime();
    const timeDiff = (currentTime - parseInt(loginTime)) / (1000 * 60); // Convert to minutes

    if (timeDiff > ADMIN_CONFIG.sessionTimeout) {
        handleLogout();
        return false;
    }

    return true;
}

// Initialize Admin Panel
function initializeAdminPanel() {
    // Load profile data
    loadProfileData();
    
    // Load timeline posts
    loadTimelinePosts();
    
    // Setup navigation
    setupNavigation();
    
    // Setup file uploads
    setupFileUploads();
    
    // Setup forms
    setupForms();
}

// Load Profile Data
function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {
        fullName: 'Admin',
        title: 'Administrator',
        email: '',
        bio: '',
        profileImage: ''
    };

    // Fill in profile form
    document.getElementById('fullName').value = profileData.fullName;
    document.getElementById('title').value = profileData.title;
    document.getElementById('email').value = profileData.email;
    document.getElementById('bio').value = profileData.bio;
    
    // Update header profile info
    document.getElementById('headerUserName').textContent = profileData.fullName;
    document.getElementById('headerUserTitle').textContent = profileData.title;
    
    // Display profile image if exists
    if (profileData.profileImage && profileData.profileImage !== 'data:,') {
        document.getElementById('profileImagePreview').src = profileData.profileImage;
        document.getElementById('profileImagePreview').style.display = 'block';
        
        // Also update header profile image
        document.getElementById('headerProfileImage').src = profileData.profileImage;
    }
}

// Setup Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item');
    const sections = document.querySelectorAll('.admin-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding section
            const target = item.getAttribute('data-target');
            if (target) {
                sections.forEach(section => {
                    section.style.display = section.id === target ? 'block' : 'none';
                });
            }
        });
    });

    // Handle sidebar toggle
    const sidebarToggle = document.querySelector('.admin-sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

// Setup File Uploads
function setupFileUploads() {
    // Profile image upload
    const profileUpload = document.querySelector('#profile .admin-file-upload');
    const profilePreview = document.getElementById('profileImagePreview');
    
    if (profileUpload) {
        profileUpload.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profilePreview.src = e.target.result;
                        profilePreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // Post image upload
    const postUpload = document.querySelector('#postForm .admin-file-upload');
    const postPreview = document.getElementById('postImagePreview');
    
    if (postUpload) {
        postUpload.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        postPreview.src = e.target.result;
                        postPreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }
}

// Setup Forms
function setupForms() {
    // Profile form
    const profileForm = document.querySelector('#profile form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                fullName: document.getElementById('fullName').value,
                title: document.getElementById('title').value,
                email: document.getElementById('email').value,
                bio: document.getElementById('bio').value,
                profileImage: document.getElementById('profileImagePreview').src
            };
            
            localStorage.setItem('profileData', JSON.stringify(formData));
            showNotification('Profile updated successfully!', 'success');
        });
    }

    // Post form
    const postForm = document.getElementById('postForm');
    if (postForm) {
        postForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const postId = postForm.dataset.editId;
            const formData = {
                id: postId ? parseInt(postId) : Date.now(),
                title: document.getElementById('postTitle').value,
                date: document.getElementById('postDate').value,
                category: document.getElementById('postCategory').value,
                description: document.getElementById('postDescription').value,
                image: document.getElementById('postImagePreview').src,
                link: document.getElementById('postLink').value
            };
            
            // Get existing posts
            const posts = JSON.parse(localStorage.getItem('timelinePosts') || '[]');
            
            if (postId) {
                // Update existing post
                const index = posts.findIndex(p => p.id === parseInt(postId));
                if (index !== -1) {
                    posts[index] = formData;
                    showNotification('Post updated successfully!', 'success');
                }
                // Clear the edit ID
                delete postForm.dataset.editId;
            } else {
                // Add new post
                posts.push(formData);
                showNotification('Post added successfully!', 'success');
            }
            
            // Save updated posts
            localStorage.setItem('timelinePosts', JSON.stringify(posts));
            
            // Reload posts display
            loadTimelinePosts();
            
            // Close modal and reset form
            hideModal();
            postForm.reset();
            document.getElementById('postImagePreview').style.display = 'none';
        });
    }

    // Settings form
    const settingsForm = document.querySelector('#settings form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Hash passwords for comparison
            const hashedCurrentPassword = CryptoJS.SHA256(currentPassword).toString();
            const hashedNewPassword = CryptoJS.SHA256(newPassword).toString();
            
            if (hashedCurrentPassword !== ADMIN_CONFIG.passwordHash) {
                showNotification('Current password is incorrect!', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match!', 'error');
                return;
            }
            
            // Update password in config
            ADMIN_CONFIG.passwordHash = hashedNewPassword;
            
            // Clear form
            settingsForm.reset();
            showNotification('Password updated successfully!', 'success');
        });
    }
}

// Show Modal
function showModal() {
    document.querySelector('.admin-modal').classList.add('active');
}

// Hide Modal
function hideModal() {
    document.querySelector('.admin-modal').classList.remove('active');
}

// Load Timeline Posts
function loadTimelinePosts() {
    const postsContainer = document.getElementById('timelinePosts');
    if (!postsContainer) return;

    const posts = JSON.parse(localStorage.getItem('timelinePosts') || '[]');
    
    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-history"></i>
                <h3>No Timeline Posts Yet</h3>
                <p>Click "Add New Post" to create your first timeline entry.</p>
            </div>
        `;
        return;
    }
    
    postsContainer.innerHTML = posts.map((post, index) => {
        // Ensure each post has an ID
        const postId = post.id || Date.now() + index;
        if (!post.id) {
            post.id = postId;
        }
        
        return `
            <div class="timeline-post-card" data-id="${postId}">
                ${post.image && post.image !== 'data:,' ? `<img src="${post.image}" alt="${post.title}" class="timeline-post-image">` : ''}
                <div class="timeline-post-content">
                    <h3 class="timeline-post-title">${post.title}</h3>
                    <div class="timeline-post-date">${formatDate(post.date)}</div>
                    <div class="timeline-post-category">${formatCategory(post.category)}</div>
                    <p class="timeline-post-description">${post.description}</p>
                    ${post.link ? `<a href="${post.link}" target="_blank" class="timeline-post-link">View Link</a>` : ''}
                    <div class="timeline-post-actions">
                        <button class="timeline-post-edit" onclick="editPost(${postId})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="timeline-post-delete" onclick="deletePost(${postId})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Update the stored posts with IDs if any were added
    localStorage.setItem('timelinePosts', JSON.stringify(posts));
}

// Format Date for display
function formatDate(dateString) {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Format Category for display
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

// Edit Post
function editPost(postId) {
    const posts = JSON.parse(localStorage.getItem('timelinePosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        const form = document.getElementById('postForm');
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postDate').value = post.date;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postDescription').value = post.description;
        document.getElementById('postLink').value = post.link || '';
        
        const imagePreview = document.getElementById('postImagePreview');
        if (post.image) {
            imagePreview.src = post.image;
            imagePreview.style.display = 'block';
        }

        // Store the post ID for updating
        form.dataset.editId = postId;
        
        showModal();
    }
}

// Delete Post
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        const posts = JSON.parse(localStorage.getItem('timelinePosts') || '[]');
        const updatedPosts = posts.filter(p => p.id !== postId);
        localStorage.setItem('timelinePosts', JSON.stringify(updatedPosts));
        loadTimelinePosts();
        showNotification('Post deleted successfully!', 'success');
    }
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Hash the password
    const hashedPassword = CryptoJS.SHA256(password).toString();
    
    if (username === ADMIN_CONFIG.username && hashedPassword === ADMIN_CONFIG.passwordHash) {
        // Set login time
        localStorage.setItem('adminLoginTime', new Date().getTime());
        window.location.href = 'index.html';
    } else {
        showNotification('Invalid credentials. Please try again.', 'error');
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('adminLoginTime');
    window.location.href = 'login.html';
} 