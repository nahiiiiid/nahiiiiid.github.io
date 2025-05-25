const commands = {
    help: {
        execute: () => displayHelp(),
        help: 'Show list of available commands'
    },
    clear: {
        execute: () => clearTerminal(),
        help: 'Clear terminal history'
    },
    about: {
        execute: () => executeCommand('insights'),
        help: 'Show about section'
    },
    skills: {
        execute: () => executeCommand('skills'),
        help: 'Show technical skills'
    },
    projects: {
        execute: () => executeCommand('projects'),
        help: 'Show projects section'
    },
    education: {
        execute: () => executeCommand('education'),
        help: 'Show education section'
    },
    theme: {
        execute: (args) => changeTheme(args[0]),
        help: 'Change color theme [dark/light/matrix]'
    },
    repo: {
        execute: () => window.open('https://github.com/yourusername', '_blank'),
        help: 'Open GitHub repository'
    },
    history: {
        execute: () => showHistory(),
        help: 'Show command history'
    },
    sudo: {
        execute: () => 'Nice try! 🐧',
        help: 'Superuser command (restricted)'
    }
};

let commandHistory = [];
const sections = {};

document.addEventListener('DOMContentLoaded', () => {
    initializeTerminal();
    setupScrollObserver();
    populateHelpModal();
    loadContent();
    initializeSections();
    loadTheme();
    loadCommandHistory();
});

function initializeTerminal() {
  const inputIds = ['cmdInput', 'commandInput'];

  inputIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          processCommand(e.target.value);
          e.target.value = ''; // Optional: clear the input after submitting
        }
      });
    }
  });
}


function processCommand(input) {
    if (!input.trim()) return;

    const [command, ...args] = input.trim().split(' ');
    addToHistory(`$ ${input}`, 'command');

    if (commands[command]) {
        try {
            const result = commands[command].execute(args);
            if (result) addToHistory(result);
        } catch (error) {
            addToHistory(`Error: ${error.message}`, 'error');
        }
    } else {
        addToHistory(`Command not found: ${command}. Try 'help'`, 'error');
    }

    updateCommandHistory(input);
    document.getElementById('cmdInput').value = '';
    document.getElementById('commandInput').value = '';
}

function displayHelp() {
    let helpText = 'Available commands:\n\n';
    for (const [cmd, details] of Object.entries(commands)) {
        helpText += `${cmd.padEnd(10)} ${details.help}\n`;
    }
    return helpText;
}

function clearTerminal() {
    document.getElementById('history').innerHTML = '';
    return 'Terminal cleared successfully';
}

function changeTheme(theme) {
    const validThemes = [
        'dark', 'light', 'matrix',
        'cyberpunk', 'dracula', 'midnight',
        'solarized', 'crt', 'sunset',
        'ocean', 'coffee', 'nord'
    ];
    if (!theme) return 'Usage: theme [dark|light|matrix]';
    if (!validThemes.includes(theme)) return `Invalid theme. Available: ${validThemes.join(', ')}`;

    document.body.className = `${theme}-theme`;
    localStorage.setItem('terminalTheme', theme);
    return `Theme changed to ${theme}`;
}

function showHistory() {
    return commandHistory.length
        ? 'Command history:\n' + commandHistory.join('\n')
        : 'No command history available';
}

function populateHelpModal() {
    const commandList = document.getElementById('commandList');
    commandList.innerHTML = Object.entries(commands)
        .map(([cmd, details]) => `
            <div class="command-item">
                <span class="command-name">${cmd}</span>
                <span class="command-desc">${details.help}</span>
            </div>
        `).join('');
}

function executeCommand(sectionId) {
    const section = sections[sectionId];
    if (!section) {
        addToHistory(`Section "${sectionId}" not found!`, 'error');
        return;
    }

    if (!section.visited) {
        loadSectionContent(sectionId);
        section.visited = true;
    }

    section.element.classList.add('active');
    section.element.scrollIntoView({ behavior: 'smooth' });
    return `Navigated to ${sectionId} section`;
}

function initializeSections() {
    document.querySelectorAll('.section').forEach(section => {
        sections[section.id] = {
            element: section,
            visited: false
        };
    });
}

function loadSectionContent(sectionId) {
    switch (sectionId) {
        case 'education':
            const educationData = [
                {
                    type: 'school',
                    title: 'Primary School',
                    institution: 'Dwipnagar High School',
                    duration: '20',
                    details: ['Board: State Board', 'Percentage: 92%'],
                    color: '#7ee787' // Green
                },
                {
                    type: 'college',
                    title: 'Intermediate',
                    institution: 'Your College Name',
                    duration: '2018-2020',
                    details: ['Stream: Science', 'Percentage: 89%'],
                    color: '#58a6ff' // Blue
                },
                {
                    type: 'university',
                    title: 'B.Tech Computer Science',
                    institution: 'Your University Name',
                    duration: '2020-2024',
                    details: ['CGPA: 9.2', 'Specialization: Cyber Security'],
                    color: '#d2a8ff' // Purple
                },
                {
                    type: 'university',
                    title: 'B.Tech Computer Science',
                    institution: 'Your University Name',
                    duration: '2020-2024',
                    details: ['CGPA: 9.2', 'Specialization: Cyber Security'],
                    color: '#d2a8ff' // Purple
                }
            ];

            const educationHTML = educationData.map(edu => `
                <div class="education-node" style="border-left: 4px solid ${edu.color}">
                    <div class="node-header">
                        <i class="fas fa-${edu.type === 'school' ? 'school' : 
                          edu.type === 'college' ? 'university' : 'graduation-cap'}" 
                          style="color: ${edu.color}"></i>
                        <h3>${edu.title}</h3>
                        <span class="duration">${edu.duration}</span>
                    </div>
                    <div class="node-body">
                        <p class="institution">${edu.institution}</p>
                        ${edu.details.map(detail => `<p>>_ ${detail}</p>`).join('')}
                    </div>
                </div>
            `).join('');

            document.querySelector('.education-list').innerHTML = `
                <div class="education-tree">
                    ${educationHTML}
                </div>
            `;
            break;

    }
}

function loadContent() {
    const skills = [
        { name: 'Python', icon: 'fab fa-python', desc: 'Scripting & Automation' },
        { name: 'C++', icon: 'fas fa-file-code', desc: 'System Programming' },
        { name: 'Linux', icon: 'fab fa-linux', desc: 'System Administration' },
        { name: 'Cybersecurity', icon: 'fas fa-shield-alt', desc: 'Ethical Hacking' },
        { name: 'Networking', icon: 'fas fa-network-wired', desc: 'TCP/IP, DNS' },
        { name: 'Web Dev', icon: 'fas fa-code', desc: 'Full Stack Development' },
        { name: 'Machine Learning', icon: 'fas fa-robot', desc: 'Data Analysis & AI' },
        { name: 'Penetration Testing', icon: 'fas fa-bug', desc: 'Vulnerability Assessment' },
        { name: 'Reverse Engineering', icon: 'fas fa-microchip', desc: 'Malware Analysis' },
        { name: 'Cryptography', icon: 'fas fa-lock', desc: 'Encryption & Security' }
    ];

    const skillsGrid = document.querySelector('.skills-grid');
    skills.forEach(skill => {
        skillsGrid.innerHTML += `
            <div class="skill-card">
                <i class="${skill.icon} fa-2x"></i>
                <h3>${skill.name}</h3>
                <p>${skill.desc}</p>
            </div>
        `;
    });

    const projects = [
        {
            name: 'Network Scanner',
            desc: 'Advanced Python-based network analysis tool with real-time monitoring and threat detection capabilities. Supports multiple scanning protocols and provides detailed network topology mapping.',
            tech: 'Python, Scapy, Socket, Nmap',
            link: '#'
        },
        {
            name: 'Malware Detector',
            desc: 'Machine learning powered detection system using behavioral analysis and signature matching. Implements real-time monitoring with automated quarantine system for suspicious files.',
            tech: 'Python, TensorFlow, Scikit-learn, Cuckoo Sandbox',
            link: '#'
        },
        {
            name: 'Network Scanner',
            desc: 'Advanced Python-based network analysis tool with real-time monitoring and threat detection capabilities. Supports multiple scanning protocols and provides detailed network topology mapping.',
            tech: 'Python, Scapy, Socket, Nmap',
            link: '#'
        },
        {
            name: 'Malware Detector',
            desc: 'Machine learning powered detection system using behavioral analysis and signature matching. Implements real-time monitoring with automated quarantine system for suspicious files.',
            tech: 'Python, TensorFlow, Scikit-learn, Cuckoo Sandbox',
            link: '#'
        },
        {
            name: 'Network Scanner',
            desc: 'Advanced Python-based network analysis tool with real-time monitoring and threat detection capabilities. Supports multiple scanning protocols and provides detailed network topology mapping.',
            tech: 'Python, Scapy, Socket, Nmap',
            link: '#'
        },
        {
            name: 'Malware Detector',
            desc: 'Machine learning powered detection system using behavioral analysis and signature matching. Implements real-time monitoring with automated quarantine system for suspicious files.',
            tech: 'Python, TensorFlow, Scikit-learn, Cuckoo Sandbox',
            link: '#'
        },
        {
            name: 'Network Scanner',
            desc: 'Advanced Python-based network analysis tool with real-time monitoring and threat detection capabilities. Supports multiple scanning protocols and provides detailed network topology mapping.',
            tech: 'Python, Scapy, Socket, Nmap',
            link: '#'
        }
    ];

    // In loadContent() function
    const projectsGrid = document.querySelector('.projects-grid');
    projects.forEach(project => {
        projectsGrid.innerHTML += `
        <div class="project-card">
            <h3 class="project-name">${project.name}</h3>
            <p class="project-desc">${project.desc}</p>
            <div class="project-tech">${project.tech}</div>
            <a href="${project.link}" target="_blank" class="project-link">
                View Code
                <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
    `;
    });
}

function addToHistory(text, type) {
    const history = document.getElementById('history');
    const entry = document.createElement('div');
    entry.className = `command-${type}`;
    entry.textContent = text;
    entry.style.color = {
        error: 'var(--error-color)',
        success: 'var(--success-color)',
        command: 'var(--text-color)'
    }[type] || 'var(--text-color)';

    history.appendChild(entry);
    history.scrollTop = history.scrollHeight;
}

function updateCommandHistory(command) {
    commandHistory.push(command);
    if (commandHistory.length > 50) commandHistory.shift();
    localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
}

function loadTheme() {
    const savedTheme = localStorage.getItem('terminalTheme') || 'dark';
    document.body.className = `${savedTheme}-theme`;
}

// Update the setupScrollObserver function
function setupScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load content if not already loaded
                if (entry.target.id === 'education' && !sections['education']?.visited) {
                    loadSectionContent('education');
                }
                
                // Activate section and nodes
                entry.target.classList.add('active');
                initializeSections();
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

function toggleHelp() {
    const modal = document.getElementById('helpModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Initialize command history from localStorage
function loadCommandHistory() {
    const savedHistory = localStorage.getItem('commandHistory');
    if (savedHistory) commandHistory = JSON.parse(savedHistory);
}


