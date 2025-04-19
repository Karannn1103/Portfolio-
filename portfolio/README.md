# Professional Portfolio Website

A modern, responsive portfolio website with an admin panel for easy content management. This portfolio is designed with an Apple-inspired aesthetic, featuring clean design, smooth animations, and intuitive navigation.

## Features

- **Responsive Design**: Looks great on all devices, from mobile to desktop
- **Modern UI**: Clean, Apple-inspired design with smooth animations
- **Admin Panel**: Easily update your personal information, skills, projects, and resume
- **Dynamic Content**: All content is loaded from a JSON file, making it easy to update
- **Project Filtering**: Filter projects by category
- **Contact Form**: Allow visitors to get in touch with you
- **Social Media Integration**: Link to all your social media profiles

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your browser to view the portfolio
3. To access the admin panel, go to `/admin/index.html`
   - Default login: username: `admin`, password: `admin123`

## Customizing Your Portfolio

### Using the Admin Panel

1. Log in to the admin panel at `/admin/index.html`
2. Navigate through the different sections to update your information:
   - **Personal Info**: Update your name, title, about text, contact details, and social media links
   - **Skills**: Add, edit, or remove skills with custom icons and proficiency levels
   - **Projects**: Manage your portfolio projects with images, descriptions, and links
   - **Resume**: Upload your CV/resume file

### Manual Customization

If you prefer to edit files directly:

1. Update the `data/portfolio.json` file to change your personal information, skills, and projects
2. Replace images in the `images/` directory with your own
3. Modify the CSS in `css/styles.css` to change colors, fonts, or layout

## File Structure

```
portfolio/
├── index.html              # Main portfolio page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── main.js             # Main JavaScript file
│   ├── skills.js           # Skills section functionality
│   └── projects.js         # Projects section functionality
├── data/
│   └── portfolio.json      # All portfolio data
├── images/                 # Image assets
│   ├── profile.jpg         # Your profile picture
│   └── projects/           # Project images
├── files/                  # Downloadable files (resume, etc.)
└── admin/                  # Admin panel
    ├── index.html          # Admin login page
    ├── dashboard.html      # Admin dashboard
    ├── css/
    │   └── admin.css       # Admin panel styles
    └── js/
        ├── login.js        # Admin login functionality
        └── admin.js        # Admin panel functionality
```

## Customization Options

### Colors

The main colors can be changed in the `:root` section of `css/styles.css`:

```css
:root {
    --primary-color: #0071e3;      /* Main accent color */
    --secondary-color: #1d1d1f;    /* Secondary color */
    --text-color: #1d1d1f;         /* Main text color */
    --light-text: #86868b;         /* Secondary text color */
    --background-color: #ffffff;   /* Main background */
    --section-bg: #f5f5f7;         /* Section background */
    --border-color: #d2d2d7;       /* Border color */
    --success-color: #4cd964;      /* Success messages */
    --error-color: #ff3b30;        /* Error messages */
}
```

### Fonts

The default font is Apple's SF Pro Display with system fallbacks. To change the font, update the `body` section in `css/styles.css`:

```css
body {
    font-family: 'Your Font', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## Browser Support

This portfolio website works in all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FontAwesome for the icons
- Google Fonts for the typography options
- Apple for design inspiration 