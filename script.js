document.addEventListener('DOMContentLoaded', () => {
    // Skills Data
    const skills = [
        { 
            name: 'Python',
            icon: 'fab fa-python',
            description: 'My primary language for data analysis and backend development'
        },
        {
            name: 'C++',
            icon: 'fab fa-cuttlefish',
            description: 'My go-to language for competitive programming and algorithm design'       
        },
        { 
            name: 'JavaScript',
            icon: 'fab fa-js',
            description: 'Building interactive web applications and full-stack projects'
        },
        { 
            name: 'Git',
            icon: 'fab fa-git-alt',
            description: 'Version control and collaborative development'
        },
        { 
            name: 'HTML & CSS',
            icon: 'fab fa-html5',
            description: 'Structuring and styling web pages'
        },
        { 
            name: 'Machine Learning',
            icon: 'fas fa-robot',
            description: 'Building predictive models and data analysis'
        },
        { 
            name: 'Django',
            icon: 'fab fa-python',
            description: 'Web framework for building robust applications'
        },
        { 
            name: 'Flask',
            icon: 'fab fa-python',
            description: 'Lightweight web framework for Python'
        },
        { 
            name: 'MySQL',
            icon: 'fas fa-database',
            description: 'Relational database management system'
        },
        { 
            name: 'TensorFlow',
            icon: 'fab fa-python',
            description: 'Open-source library for machine learning and AI'
        },
        { 
            name: 'Flask',
            icon: 'fab fa-python',
            description: 'Micro web framework for Python'
        },
 


    ];

    // Projects Data
    const projects = [
        { 
            title: 'E-Commerce Platform',
            image: 'image.png',
            tech: 'React, Node.js, MongoDB',
            description: 'Full-stack e-commerce solution with payment integration',
            link: '#'
        },
        { 
            title: 'Social Media App',
            image: 'image.png',
            tech: 'React Native, Firebase',
            description: 'Mobile social network with real-time chat',
            link: '#'
        },
        { 
            title: 'ML Price Predictor',
            image: 'image.png',
            tech: 'Python, TensorFlow, Flask',
            description: 'Machine learning model for real estate price prediction',
            link: '#'
        },
        { 
            title: 'E-Commerce Platform',
            image: 'image.png',
            tech: 'React, Node.js, MongoDB',
            description: 'Full-stack e-commerce solution with payment integration',
            link: '#'
        },
        { 
            title: 'Social Media App',
            image: 'image.png',
            tech: 'React Native, Firebase',
            description: 'Mobile social network with real-time chat',
            link: '#'
        },
        { 
            title: 'ML Price Predictor',
            image: 'image.png',
            tech: 'Python, TensorFlow, Flask',
            description: 'Machine learning model for real estate price prediction',
            link: '#'
        }
    ];

    // Education Data
    const education = [
        {
            year: '2020-2024',
            degree: 'B.Tech in Computer Science',
            institution: 'Your University'
        },
        {
            year: '2018-2020',
            degree: 'Higher Secondary',
            institution: 'Your College'
        },
        {
            year: '2008-2018',
            degree: 'Secondary Education',
            institution: 'Your School'
        }
    ];

    // Populate Skills
    const skillsContainer = document.querySelector('.skills-container');
    skills.forEach(skill => {
        const skillCard = document.createElement('div');
        skillCard.className = 'skill-card';
        skillCard.innerHTML = `
            <div class="skill-content">
                <i class="${skill.icon} skill-icon"></i>
                <h3 class="skill-name">${skill.name}</h3>
            </div>
            <div class="skill-description">
                <p>${skill.description}</p>
            </div>
        `;
        skillsContainer.appendChild(skillCard);
    });

    // Populate Projects
    const projectsGrid = document.querySelector('.projects-grid');
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-overlay">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-tech">${project.tech}</p>
                <p class="project-description">${project.description}</p>
                <a href="${project.link}" class="project-link">View Project</a>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });

    // Populate Education Timeline
    const timeline = document.querySelector('.timeline');
    education.forEach((edu, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${index % 2 === 0 ? 'left' : 'right'}`;
        timelineItem.innerHTML = `
            <div class="timeline-content">
                <h3>${edu.year}</h3>
                <h4>${edu.degree}</h4>
                <p>${edu.institution}</p>
            </div>
        `;
        timeline.appendChild(timelineItem);
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled-nav');
    } else {
        nav.classList.remove('scrolled-nav');
    }
});
});