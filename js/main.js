document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    let configData = {}; // Store loaded config

    // --- Theme Management ---
    function applyThemeColors(themeConfig) {
        if (!themeConfig) return;
        // Set on <body> so the values win over the defaults in style.css for both themes
        const root = document.body.style;
        const variables = {
            '--primary-color': themeConfig.primaryColor,
            '--page-background-color': themeConfig.backgroundColor,
            '--sidebar-background-color': themeConfig.sidebarBackgroundColor,
            '--main-content-background-color': themeConfig.mainContentBackgroundColor,
            '--text-color': themeConfig.textColor,
            '--subtext-color': themeConfig.subtextColor,
            '--border-color': themeConfig.borderColor,
            '--card-shadow': themeConfig.cardShadow
        };
        // A colour missing from the config falls back to the default in style.css
        Object.entries(variables).forEach(([name, value]) => {
            if (value) root.setProperty(name, value);
            else root.removeProperty(name);
        });
    }

    function setTheme(isDark, remember) {
        const bodyClassList = document.body.classList;
        bodyClassList.toggle('dark-mode', isDark);
        themeToggleIcon.classList.toggle('fa-moon', isDark);
        themeToggleIcon.classList.toggle('fa-sun', !isDark);
        if (configData.themeSettings) applyThemeColors(isDark ? configData.themeSettings.dark : configData.themeSettings.light);
        if (remember) {
            try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) { /* storage unavailable */ }
        }
    }

    themeToggleButton.addEventListener('click', () => {
        setTheme(!document.body.classList.contains('dark-mode'), true);
    });

    // --- Helpers ---
    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    function setText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) element.textContent = text || '';
    }
    function setVisible(elementId, visible) {
        const element = document.getElementById(elementId);
        if (element) element.hidden = !visible;
    }
    function asList(value) {
        return Array.isArray(value) ? value : [];
    }
    function joinItems(value) {
        return Array.isArray(value) ? value.join(', ') : (value || '');
    }
    // A link is only shown when it points somewhere ("" and "#" count as empty)
    function hasLink(url) {
        return typeof url === 'string' && url.trim() !== '' && url.trim() !== '#';
    }

    // --- Populate Resume ---
    function populateResume(data) {
        configData = data || {};
        const pi = configData.personalInfo || {};
        const sections = configData.sections || {};
        const sidebar = sections.sidebar || {};
        const main = sections.main || {};
        const footer = configData.footer || {};

        // Page Title & Favicon
        document.title = pi.name ? `${pi.name} - Resume` : 'Resume';
        if (pi.faviconPath) document.getElementById('favicon').href = pi.faviconPath;

        // Sidebar: Profile
        const profileImage = document.getElementById('profileImage');
        if (pi.profileImage) profileImage.src = pi.profileImage;
        profileImage.alt = pi.name ? `${pi.name} profile picture` : 'Profile picture';
        setVisible('profileImage', Boolean(pi.profileImage));
        setText('userName', pi.name);
        setText('userTitle', pi.title);

        // Sidebar: About Me
        setText('sidebarAboutMeText', sidebar.aboutMe);
        setVisible('sidebar-about-section', Boolean(sidebar.aboutMe));

        // Sidebar: Contact
        const contactItems = [];
        if (pi.location) contactItems.push(`<li><i class="fas fa-map-marker-alt fa-fw"></i> <span>${escapeHtml(pi.location)}</span></li>`);
        if (pi.phone) {
            // Keep a leading "+" so international numbers stay dialable
            const dialable = String(pi.phone).replace(/(?!^\+)\D/g, '');
            const phoneLabel = `<i class="fas fa-phone-alt fa-fw"></i> <span>${escapeHtml(pi.phone)}</span>`;
            contactItems.push(/\d/.test(dialable) ? `<li><a href="tel:${dialable}">${phoneLabel}</a></li>` : `<li>${phoneLabel}</li>`);
        }
        if (pi.email) contactItems.push(`<li><a href="mailto:${escapeHtml(pi.email)}"><i class="fas fa-envelope fa-fw"></i> <span>${escapeHtml(pi.email)}</span></a></li>`);
        if (hasLink(pi.websiteURL)) contactItems.push(`<li><a href="${escapeHtml(pi.websiteURL)}" target="_blank" rel="noopener noreferrer"><i class="fas fa-globe fa-fw"></i> <span>${escapeHtml(pi.websiteLabel || pi.websiteURL)}</span></a></li>`);
        if (hasLink(pi.linkedinURL)) contactItems.push(`<li><a href="${escapeHtml(pi.linkedinURL)}" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin-in fa-fw"></i> <span>${escapeHtml(pi.linkedinUser || 'LinkedIn')}</span></a></li>`);
        if (hasLink(pi.githubURL)) contactItems.push(`<li><a href="${escapeHtml(pi.githubURL)}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github fa-fw"></i> <span>${escapeHtml(pi.githubUser || 'GitHub')}</span></a></li>`);
        document.getElementById('contactList').innerHTML = contactItems.join('');
        setVisible('sidebar-contact-section', contactItems.length > 0);

        // Sidebar: Skills
        const skills = asList(sidebar.skills);
        document.getElementById('skillsListContainer').innerHTML = skills.map(skillGroup => `
            <div>
                ${skillGroup.category ? `<h4 class="skill-category-title">${escapeHtml(skillGroup.category)}</h4>` : ''}
                <p class="skill-items">${escapeHtml(joinItems(skillGroup.items))}</p>
            </div>`).join('');
        setVisible('sidebar-skills-section', skills.length > 0);

        // Sidebar: Languages
        const languages = asList(sidebar.languages);
        document.getElementById('languagesListSidebar').innerHTML = languages.map(lang => `
            <li>${escapeHtml(lang.name)}${lang.level ? `: <span class="text-subtext-color">${escapeHtml(lang.level)}</span>` : ''}</li>`).join('');
        setVisible('sidebar-languages-section', languages.length > 0);

        // Sidebar: Interests
        const interests = joinItems(sidebar.interests);
        setText('interestsText', interests);
        setVisible('sidebar-interests-section', Boolean(interests));

        // Main Content: Education
        const education = asList(main.education);
        document.getElementById('educationListMain').innerHTML = education.map(edu => `
            <div class="education-item">
                <div class="education-header">
                    <h3 class="education-degree">${escapeHtml(edu.degree)}</h3>
                    <div class="education-meta">
                        ${edu.institution ? `<span class="education-institution">${escapeHtml(edu.institution)}</span>` : ''}
                        ${edu.period ? `<span class="education-period">${escapeHtml(edu.period)}</span>` : ''}
                    </div>
                </div>
                ${edu.gpa ? `<div class="education-gpa">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
                ${edu.details ? `<div class="education-details">${escapeHtml(edu.details)}</div>` : ''}
                ${asList(edu.achievements).length > 0 ? `
                    <ul class="education-achievements">
                        ${asList(edu.achievements).map(achievement => `
                            <li><i class="fas fa-check text-primary-color"></i> <span>${escapeHtml(achievement)}</span></li>
                        `).join('')}
                    </ul>
                ` : ''}
            </div>`).join('');
        setVisible('main-education-section', education.length > 0);

        // Main Content: Experience
        const experience = asList(main.experience);
        document.getElementById('experienceListContainer').innerHTML = experience.map(exp => {
            const meta = [exp.location, exp.period].filter(Boolean).map(escapeHtml).join(' | ');
            const responsibilities = asList(exp.responsibilities);
            return `
            <div class="experience-item">
                <h3 class="experience-item-title">${escapeHtml(exp.title)}</h3>
                ${exp.company ? `<p class="experience-item-company">${escapeHtml(exp.company)}</p>` : ''}
                ${meta ? `<p class="experience-item-meta">${meta}</p>` : ''}
                ${exp.summary ? `<p class="experience-item-summary">${escapeHtml(exp.summary)}</p>` : ''}
                ${responsibilities.length > 0 ? `
                    <ul class="experience-item-responsibilities">
                        ${responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                    </ul>` : ''}
            </div>`;
        }).join('');
        setVisible('main-experience-section', experience.length > 0);

        // Main Content: Projects
        const projects = asList(main.projects);
        document.getElementById('projectsListContainer').innerHTML = projects.map(proj => `
            <div class="project-card">
                <h3 class="project-name">${escapeHtml(proj.name)}</h3>
                ${proj.technologies ? `<p class="project-tech">${escapeHtml(joinItems(proj.technologies))}</p>` : ''}
                ${proj.description ? `<p class="project-description">${escapeHtml(proj.description)}</p>` : ''}
                <div class="project-links mt-2">
                    ${hasLink(proj.link) ? `<a href="${escapeHtml(proj.link)}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                    ${hasLink(proj.githubLink) ? `<a href="${escapeHtml(proj.githubLink)}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>` : ''}
                </div>
            </div>`).join('');
        setVisible('main-projects-section', projects.length > 0);

        // Main Content: Publications
        const publications = asList(main.publications);
        document.getElementById('publicationsListContainer').innerHTML = publications.map(pub => {
            const venue = [pub.venue, pub.year ? `(${pub.year})` : ''].filter(Boolean).map(escapeHtml).join(' ');
            return `
            <div class="publication-item">
                <h4 class="publication-title">${escapeHtml(pub.title)}</h4>
                ${pub.authors ? `<p class="publication-authors">${escapeHtml(pub.authors)}</p>` : ''}
                ${venue ? `<p class="publication-venue">${venue}</p>` : ''}
                ${hasLink(pub.link) ? `<a href="${escapeHtml(pub.link)}" target="_blank" rel="noopener noreferrer" class="publication-link">${escapeHtml(pub.linkText || 'View publication')} <i class="fas fa-external-link-alt fa-xs"></i></a>` : ''}
            </div>`;
        }).join('');
        setVisible('main-publications-section', publications.length > 0);

        // Footer
        setText('footerText', footer.text);
        const footerRepoLink = document.getElementById('footerRepoLink');
        if (hasLink(footer.repoLink)) {
            footerRepoLink.href = footer.repoLink;
            footerRepoLink.textContent = footer.repoLinkText || footer.repoLink;
        }
        footerRepoLink.hidden = !hasLink(footer.repoLink);
        setVisible('page-footer', Boolean(footer.text) || hasLink(footer.repoLink));

        // Set Initial Theme
        let preferredTheme = null;
        try { preferredTheme = localStorage.getItem('theme'); } catch (e) { /* storage unavailable */ }
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(preferredTheme === 'dark' || (!preferredTheme && systemPrefersDark), false);
    }

    function showError(message) {
        const mainContent = document.getElementById('main-content') || document.body;
        mainContent.innerHTML = `<p class="text-red-500 text-center p-8 font-bold">${message}</p>`;
    }

    // Fetch and Load Data
    fetch('config/data.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => populateResume(data))
        .catch(error => {
            console.error('Error loading resume data:', error);
            if (window.location.protocol === 'file:') {
                showError(`This page cannot load its data when opened directly as a file. Start a local server in this folder (for example <code>python3 -m http.server</code>) and open the address it prints.`);
            } else {
                showError(`Error: Could not load resume data. Please check 'config/data.json' and ensure it's valid JSON. (Details in console)`);
            }
        });
});
