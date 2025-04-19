// Main JavaScript for Portfolio Website

// DOM Elements
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const currentYear = document.getElementById('current-year');

// Set current year in footer
currentYear.textContent = new Date().getFullYear();

// Function to load profile image
const loadProfileImage = () => {
    const profileImage = document.getElementById('profile-image');
    if (!profileImage) return;
    
    // Force reload the image to bypass cache
    const timestamp = new Date().getTime();
    const imageSrc = `images/profile.jpg?t=${timestamp}`;
    
    console.log('Loading profile image from:', imageSrc);
    
    // Set image source with cache-busting parameter
    profileImage.src = imageSrc;
    
    // Add error handler
    profileImage.onerror = function() {
        console.error('Failed to load profile image');
        this.src = 'images/projects/default.jpg';
        this.onerror = null;
    };
    
    // Add load handler to confirm success
    profileImage.onload = function() {
        console.log('Profile image loaded successfully');
    };
};

// Call the function to load profile image
window.addEventListener('DOMContentLoaded', loadProfileImage);

// Scroll event for header
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Send email using EmailJS
        // To make this work:
        // 1. Sign up at https://www.emailjs.com/ (they have a free tier)
        // 2. Create an Email Service (Gmail, Outlook, etc.)
        // 3. Create an Email Template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
        // 4. Get your Service ID, Template ID, and User ID
        // 5. Replace the placeholders below with your actual IDs
        emailjs.send(
            'YOUR_SERVICE_ID',  // Replace with your EmailJS service ID
            'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
            {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message
            },
            'YOUR_USER_ID'      // Replace with your EmailJS user ID
        )
        .then(function(response) {
            console.log('Email sent successfully:', response);
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            // Reset form
            contactForm.reset();
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        })
        .catch(function(error) {
            console.error('Email sending failed:', error);
            // Show error message
            alert('Sorry, there was a problem sending your message. Please try again later or contact me directly via email.');
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });
}

// Enhanced Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 50) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
    
    // Animate skill bars when they come into view
    const skillBars = document.querySelectorAll('.skill-level');
    skillBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (barPosition < windowHeight - 50) {
            // Get the width from the inline style or data attribute
            const width = bar.style.width || bar.getAttribute('data-width') || '0%';
            // Set a CSS variable for the animation to use
            bar.style.setProperty('--skill-percent', width);
            bar.classList.add('animate');
        }
    });
};

// Add parallax effect to hero section
const parallaxEffect = () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
            }
        });
    }
};

// Add typing animation to hero title
const typingAnimation = () => {
    const devName = document.getElementById('dev-name');
    const devTitle = document.getElementById('dev-title');
    
    if (devName && devTitle) {
        // Store original text
        const nameText = devName.textContent;
        const titleText = devTitle.textContent;
        
        // Clear text for animation
        devName.textContent = '';
        devTitle.textContent = '';
        
        // Make elements visible
        devName.style.opacity = '1';
        devTitle.style.opacity = '1';
        
        // Animate typing for name
        let nameIndex = 0;
        const typeName = () => {
            if (nameIndex < nameText.length) {
                devName.textContent += nameText.charAt(nameIndex);
                nameIndex++;
                setTimeout(typeName, 100);
            } else {
                // Start title animation after name is complete
                setTimeout(() => {
                    let titleIndex = 0;
                    const typeTitle = () => {
                        if (titleIndex < titleText.length) {
                            devTitle.textContent += titleText.charAt(titleIndex);
                            titleIndex++;
                            setTimeout(typeTitle, 50);
                        }
                    };
                    typeTitle();
                }, 500);
            }
        };
        
        // Start the typing animation
        setTimeout(typeName, 500);
    }
};

// Add floating animation to elements
const floatingAnimation = () => {
    const elements = document.querySelectorAll('.project-item, .skill-item');
    
    elements.forEach((element, index) => {
        // Add different animation delays to create a wave effect
        const delay = index * 0.2;
        element.style.animationDelay = `${delay}s`;
        element.classList.add('hover-lift');
    });
};

// Add scroll reveal animations to sections
const scrollReveal = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTitle = section.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.classList.add('scale-in');
        }
        
        // Add different animations to different section types
        if (section.id === 'about') {
            const aboutImage = section.querySelector('.about-image');
            const aboutText = section.querySelector('.about-text');
            
            if (aboutImage) aboutImage.classList.add('slide-in-left');
            if (aboutText) aboutText.classList.add('slide-in-right');
        }
        
        if (section.id === 'skills') {
            const skillItems = section.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                item.classList.add('scale-in');
                item.style.animationDelay = `${0.2 + (index * 0.1)}s`;
            });
        }
        
        if (section.id === 'projects') {
            const projectItems = section.querySelectorAll('.project-item');
            projectItems.forEach((item, index) => {
                item.classList.add('fade-in');
                item.style.animationDelay = `${0.2 + (index * 0.1)}s`;
            });
        }
        
        if (section.id === 'contact') {
            const contactInfo = section.querySelector('.contact-info');
            const contactForm = section.querySelector('.contact-form');
            
            if (contactInfo) contactInfo.classList.add('slide-in-left');
            if (contactForm) contactForm.classList.add('slide-in-right');
        }
    });
};

// Add interactive cursor effect
const customCursor = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
    });
    
    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-item, .skill-item, .social-links a');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-active');
            cursorDot.classList.add('cursor-dot-active');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-active');
            cursorDot.classList.remove('cursor-dot-active');
        });
    });
};

// Initialize all animations
const initAnimations = () => {
    // Run animations that should happen on load
    typingAnimation();
    floatingAnimation();
    scrollReveal();
    parallaxEffect();
    
    // Only add custom cursor on non-touch devices
    if (!('ontouchstart' in window)) {
        customCursor();
    }
    
    // Initial animation check
    animateOnScroll();
    
    // Animation on scroll
    window.addEventListener('scroll', animateOnScroll);
};

// Ensure social links work correctly
const ensureSocialLinksWork = () => {
    // Get all social links
    const socialLinks = document.querySelectorAll('.social-links a');
    
    // Log all social links for debugging
    console.log('Social links found:', socialLinks.length);
    
    // Make sure each link has the correct attributes and is working
    socialLinks.forEach(link => {
        console.log('Social link:', link.id, 'href:', link.href);
        
        // Ensure target and rel attributes are set
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        
        // Add click event listener for debugging
        link.addEventListener('click', function(e) {
            console.log('Social link clicked:', this.id, 'navigating to:', this.href);
        });
    });
};

// Call the function to initialize animations
window.addEventListener('load', () => {
    initAnimations();
    ensureSocialLinksWork();
});

// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filterValue = button.getAttribute('data-filter');
        
        // Filter projects
        projectItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Skill-based project filtering
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(skill => {
    skill.addEventListener('click', () => {
        // Get skill value
        const skillValue = skill.getAttribute('data-skill');
        console.log('Skill clicked:', skillValue);
        
        // Highlight the clicked skill
        skillItems.forEach(item => item.classList.remove('active'));
        skill.classList.add('active');
        
        // Scroll to projects section
        const projectsSection = document.getElementById('projects');
        window.scrollTo({
            top: projectsSection.offsetTop - 70,
            behavior: 'smooth'
        });
        
        // Reset category filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        
        // Filter projects based on skill
        projectItems.forEach(item => {
            const projectSkills = item.getAttribute('data-skills');
            if (projectSkills && projectSkills.includes(skillValue)) {
                item.style.display = 'block';
                // Add a highlight effect
                item.classList.add('highlight');
                setTimeout(() => {
                    item.classList.remove('highlight');
                }, 1000);
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Load portfolio data from JSON if available
const loadPortfolioData = async () => {
    try {
        console.log('Loading portfolio data...');
        const response = await fetch('data/portfolio.json');
        if (!response.ok) {
            throw new Error(`Failed to load portfolio data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Portfolio data loaded successfully:', data);
        
        // Update personal information
        if (data.personal) {
            console.log('Updating personal information:', data.personal);
            
            // Update name and title
            const devName = document.getElementById('dev-name');
            const devTitle = document.getElementById('dev-title');
            
            if (devName) devName.textContent = data.personal.name || 'John Doe';
            if (devTitle) devTitle.textContent = data.personal.title || 'Full Stack Developer';
            
            // Update about section
            const aboutDescription = document.getElementById('about-description');
            if (aboutDescription) aboutDescription.textContent = data.personal.about || '';
            
            // Update contact details
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const location = document.getElementById('location');
            const education = document.getElementById('education');
            
            if (email) email.textContent = data.personal.email || 'contact@example.com';
            if (phone) phone.textContent = data.personal.phone || '+1 (555) 123-4567';
            if (location) location.textContent = data.personal.location || 'San Francisco, CA';
            if (education) education.textContent = data.personal.education || 'Computer Science, Stanford';
            
            // Update footer name
            const footerName = document.getElementById('footer-name');
            if (footerName) footerName.textContent = data.personal.name || 'John Doe';
            
            // Update contact information
            const contactEmail = document.getElementById('contact-email');
            const contactPhone = document.getElementById('contact-phone');
            const contactLocation = document.getElementById('contact-location');
            
            if (contactEmail) contactEmail.textContent = data.personal.email || 'contact@example.com';
            if (contactPhone) contactPhone.textContent = data.personal.phone || '+1 (555) 123-4567';
            if (contactLocation) contactLocation.textContent = data.personal.location || 'San Francisco, CA';
            
            // Update CV link
            const cvLink = document.getElementById('cv-link');
            if (cvLink && data.personal.cvLink) {
                cvLink.href = data.personal.cvLink;
                console.log('Updated CV link:', data.personal.cvLink);
            }
            
            // Update social links
            if (data.personal.social) {
                console.log('Updating social links:', data.personal.social);
                
                const linkedinLink = document.getElementById('linkedin-link');
                const githubLink = document.getElementById('github-link');
                const twitterLink = document.getElementById('twitter-link');
                const instagramLink = document.getElementById('instagram-link');
                
                if (linkedinLink && data.personal.social.linkedin) {
                    linkedinLink.href = data.personal.social.linkedin;
                    linkedinLink.setAttribute('rel', 'noopener noreferrer');
                    linkedinLink.setAttribute('target', '_blank');
                    console.log('LinkedIn link set to:', linkedinLink.href);
                }
                if (githubLink && data.personal.social.github) {
                    githubLink.href = data.personal.social.github;
                    githubLink.setAttribute('rel', 'noopener noreferrer');
                    githubLink.setAttribute('target', '_blank');
                    console.log('GitHub link set to:', githubLink.href);
                }
                if (twitterLink && data.personal.social.twitter) {
                    twitterLink.href = data.personal.social.twitter;
                    twitterLink.setAttribute('rel', 'noopener noreferrer');
                    twitterLink.setAttribute('target', '_blank');
                    console.log('Twitter link set to:', twitterLink.href);
                }
                if (instagramLink && data.personal.social.instagram) {
                    instagramLink.href = data.personal.social.instagram;
                    instagramLink.setAttribute('rel', 'noopener noreferrer');
                    instagramLink.setAttribute('target', '_blank');
                    console.log('Instagram link set to:', instagramLink.href);
                }
            }
        }
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        console.log('Make sure the file data/portfolio.json exists and is properly formatted.');
    }
};

// Call the function to load data
loadPortfolioData(); 