// Dark Mode Functionality

// DOM Elements
const modeToggle = document.getElementById('modeToggle');
const body = document.body;

// Function to set mode based on time
const setModeByTime = () => {
    const currentHour = new Date().getHours();
    // Dark mode between 7 PM (19) and 7 AM (7)
    const isDarkModeTime = currentHour >= 19 || currentHour < 7;
    
    if (isDarkModeTime) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
};

// Function to enable dark mode
const enableDarkMode = () => {
    body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
};

// Function to enable light mode
const enableLightMode = () => {
    body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
};

// Check if user has a preference saved
const checkUserPreference = () => {
    const darkMode = localStorage.getItem('darkMode');
    
    if (darkMode === 'enabled') {
        enableDarkMode();
    } else if (darkMode === 'disabled') {
        enableLightMode();
    } else {
        // If no preference is saved, set mode based on time
        setModeByTime();
    }
};

// Toggle between dark and light mode
const toggleMode = () => {
    const darkMode = localStorage.getItem('darkMode');
    
    if (darkMode === 'enabled') {
        enableLightMode();
    } else {
        enableDarkMode();
    }
};

// Event listener for mode toggle button
modeToggle.addEventListener('click', toggleMode);

// Check user preference or set mode based on time when page loads
document.addEventListener('DOMContentLoaded', () => {
    checkUserPreference();
    
    // Update mode every hour
    setInterval(() => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('darkMode')) {
            setModeByTime();
        }
    }, 3600000); // Check every hour (3600000 ms)
});

// Add animation to mode toggle
modeToggle.addEventListener('mouseenter', () => {
    modeToggle.classList.add('hover-rotate');
});

modeToggle.addEventListener('mouseleave', () => {
    modeToggle.classList.remove('hover-rotate');
}); 