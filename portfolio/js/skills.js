// Skills JavaScript for Portfolio Website

// Function to load skills from JSON data
const loadSkills = async () => {
    try {
        const response = await fetch('data/portfolio.json');
        if (!response.ok) {
            throw new Error('Could not load skills data');
        }
        
        const data = await response.json();
        
        if (data.skills && data.skills.length > 0) {
            const skillsContainer = document.getElementById('skills-container');
            
            // Clear existing skills
            skillsContainer.innerHTML = '';
            
            // Map of skill names to icon file names
            const iconMap = {
                'javascript': 'js-file.png',
                'react': 'science.png',
                'css': 'text.png',
                'python': 'python.png',
                'html': 'html.png',
                'web development': 'web-design.png',
                'data analysis': 'exploration.png',
                'android studio': 'android.png'
            };
            // Add skills from data
            data.skills.forEach((skill, index) => {
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item scale-in';
                skillItem.setAttribute('data-skill', skill.name.toLowerCase());
                
                // Add animation delay based on index
                skillItem.style.animationDelay = `${0.2 + (index * 0.1)}s`;
                
                // Get the appropriate icon for the skill
                const skillName = skill.name.toLowerCase();
                const iconFile = iconMap[skillName] || 'html.png'; // Default to html.png if no mapping found
                
                skillItem.innerHTML = `
                    <div class="skill-icon">
                        <img src="images/icons/${iconFile}" alt="${skill.name} Icon">
                    </div>
                    <h3>${skill.name}</h3>
                    <div class="skill-bar">
                        <div class="skill-level" style="width: 0%;" data-width="${skill.level || '80'}%"></div>
                    </div>
                `;
                
                skillsContainer.appendChild(skillItem);
                
                // Add hover animation class
                skillItem.classList.add('hover-lift');
                
                // Add pulse animation to icon
                const icon = skillItem.querySelector('.skill-icon img');
                if (icon) {
                    icon.classList.add('pulse');
                }
            });
            
            // Trigger skill bar animations after a short delay
            setTimeout(() => {
                const skillLevels = document.querySelectorAll('.skill-level');
                skillLevels.forEach(level => {
                    const width = level.getAttribute('data-width');
                    level.style.width = width;
                    level.classList.add('animate');
                });
            }, 500);
        }
    } catch (error) {
        console.log('Using default skills:', error);
    }
};

// Call the function to load skills
loadSkills(); 