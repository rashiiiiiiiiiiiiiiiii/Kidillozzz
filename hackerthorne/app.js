import { INITIAL_STUDENTS, INITIAL_PROJECTS, INITIAL_REQUESTS, INITIAL_CHATS, PITCH_BLUEPRINTS } from './mockData.js';

// LocalStorage Keys
const STORAGE_KEYS = {
    STUDENTS: 'hackerthorne_students_v2',
    PROJECTS: 'hackerthorne_projects_v2',
    REQUESTS: 'hackerthorne_requests_v2',
    CHATS: 'hackerthorne_chats_v2',
    CURRENT_USER: 'hackerthorne_current_user_v2',
    SOUND_ENABLED: 'hackerthorne_sound_v2',
    THEME_ACCENT: 'hackerthorne_accent_v2'
};

// Web Audio API Synthesizer (Zero asset dependency sound fx)
class SoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== 'false';
    }

    init() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    play(type = 'click') {
        if (!this.enabled) return;
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'success') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                osc.start(now);
                osc.stop(now + 0.28);
            } else if (type === 'pop') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'task') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(660, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
                gain.gain.setValueAtTime(0.09, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            }
        } catch (e) {
            console.debug('Audio play skipped', e);
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, this.enabled);
        return this.enabled;
    }
}

const sfx = new SoundFX();

// Global App State
class AppState {
    constructor() {
        this.students = this.loadData(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
        this.projects = this.loadData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
        this.requests = this.loadData(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
        this.chats = this.loadData(STORAGE_KEYS.CHATS, INITIAL_CHATS);
        this.currentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'user-1';
        this.activeView = 'projects';
        this.activeChatId = 'chat-proj-1';
        this.inboxSubtab = 'incoming';
        this.projectFilter = 'all';
        this.projectSort = 'match';
        this.projectSortDesc = true;
        this.studentFilter = 'all';
        this.hubActiveTab = 'roster';
        this.themeAccent = localStorage.getItem(STORAGE_KEYS.THEME_ACCENT) || 'indigo';
    }

    loadData(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : JSON.parse(JSON.stringify(fallback));
        } catch (e) {
            console.error(`Error loading ${key}`, e);
            return JSON.parse(JSON.stringify(fallback));
        }
    }

    save() {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(this.requests));
        localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(this.chats));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, this.currentUserId);
        localStorage.setItem(STORAGE_KEYS.THEME_ACCENT, this.themeAccent);
    }

    reset() {
        this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
        this.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
        this.requests = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
        this.chats = JSON.parse(JSON.stringify(INITIAL_CHATS));
        this.currentUserId = 'user-1';
        this.save();
    }

    getCurrentUser() {
        return this.students.find(s => s.id === this.currentUserId) || this.students[0];
    }

    getStudentById(id) {
        return this.students.find(s => s.id === id);
    }

    getProjectById(id) {
        return this.projects.find(p => p.id === id);
    }
}

const state = new AppState();

// Utility Functions
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function debounce(fn, delay = 150) {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '★';
    toast.innerHTML = `<span style="font-weight:bold; font-size:16px;">${icon}</span> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    sfx.play(type === 'success' ? 'success' : 'click');
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Calculate Compatibility Score between a Student and a Project
function calculateMatchScore(student, project) {
    if (!student || !project) return 80;
    let score = 70;
    
    // Check if student covers any required squad role
    const coversRole = project.requiredSquadRoles.some(r => 
        r === student.primaryRole || (student.secondaryRoles && student.secondaryRoles.includes(r))
    );
    if (coversRole) score += 15;

    // Check shared skills
    const matchingSkills = (student.skills || []).filter(s => 
        (project.requiredSkills || []).some(ps => ps.toLowerCase() === s.toLowerCase())
    );
    score += Math.min(matchingSkills.length * 4, 12);

    // Advanced experience bonus
    if (student.experience === 'Advanced') score += 5;

    return Math.min(score, 98);
}

// Compute Demo Day Judge Rubric & Readiness for a Project
function computeJudgeRubric(project) {
    if (!project) return { overall: 75, technical: 75, design: 75, pitch: 75, squad: 60, advice: [] };
    
    const tasks = project.tasks || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done' || t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

    // 1. Squad Completeness (Target: 5 roles)
    const filledRoles = project.members.map(m => m.assignedRole);
    const requiredRoles = project.requiredSquadRoles || [];
    const squadCompletePct = Math.round((Math.min(project.members.length, requiredRoles.length) / Math.max(requiredRoles.length, 1)) * 100);

    // 2. Technical Execution
    let technicalScore = 65;
    if (project.githubUrl) technicalScore += 10;
    if (completedTasks > 0) technicalScore += Math.round((completedTasks / Math.max(totalTasks, 1)) * 20);
    if (project.members.some(m => m.assignedRole.includes('Backend') || m.assignedRole.includes('Cloud'))) technicalScore += 5;
    technicalScore = Math.min(technicalScore, 98);

    // 3. UI/UX Polish
    let designScore = 60;
    if (project.members.some(m => m.assignedRole.includes('UI/UX'))) designScore += 25;
    if (tasks.some(t => t.role && t.role.includes('UI/UX') && (t.status === 'done' || t.status === 'in_progress'))) designScore += 10;
    designScore = Math.min(designScore, 96);

    // 4. Pitch & Demo Story
    let pitchScore = 60;
    if (project.members.some(m => m.assignedRole.includes('Pitch') || m.assignedRole.includes('Presenter'))) pitchScore += 25;
    if (tasks.some(t => t.role && t.role.includes('Presenter') && (t.status === 'done' || t.status === 'in_progress'))) pitchScore += 10;
    pitchScore = Math.min(pitchScore, 95);

    // Overall Weighted Readiness
    const overall = Math.round((technicalScore * 0.3) + (designScore * 0.25) + (pitchScore * 0.25) + (squadCompletePct * 0.2));

    // Actionable Advice for Winning
    const advice = [];
    if (!project.members.some(m => m.assignedRole.includes('Pitch') || m.assignedRole.includes('Presenter'))) {
        advice.push("🎤 Missing a Pitch Presenter! Hackathon judges weigh demo storytelling at 30%+ of scoring. Recruit Sarah Lin or an experienced speaker.");
    }
    if (!project.members.some(m => m.assignedRole.includes('UI/UX'))) {
        advice.push("🎨 Missing dedicated UI/UX Designer. Polished wireframes and micro-interactions in Figma drastically boost judging visual appeal.");
    }
    if (completedTasks < 2) {
        advice.push("🔨 Complete at least 2 core sprint tasks on your Kanban board before code freeze to prove functional prototype viability.");
    }
    if (advice.length === 0) {
        advice.push("✨ Stellar progress! All 5 roles and milestones are on track for high judge placement.");
    }

    return {
        overall,
        technical: technicalScore,
        design: designScore,
        pitch: pitchScore,
        squad: squadCompletePct,
        advice
    };
}

// Global Modal Context
let currentSelectedProjectId = null;
let currentTargetStudentId = null;

// Initialize Application
function init() {
    applyThemeAccent(state.themeAccent);
    updateSoundIcon();
    renderUserSelector();
    setupNavigation();
    setupEventListeners();
    setupCountdownTimer();
    updateBadges();
    renderAllViews();
}

// Theme Accent Swapping
function applyThemeAccent(accent) {
    state.themeAccent = accent;
    document.body.setAttribute('data-theme-accent', accent);
    document.querySelectorAll('.accent-dot').forEach(dot => {
        if (dot.getAttribute('data-accent') === accent) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    state.save();
}

// Live Countdown Timer to HackMIT 2026 (or calculated target date)
function setupCountdownTimer() {
    function updateClock() {
        const targetDate = new Date('2026-10-18T23:59:59').getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, targetDate - now);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = document.getElementById('cd-days');
        const hEl = document.getElementById('cd-hours');
        const mEl = document.getElementById('cd-mins');
        const sEl = document.getElementById('cd-secs');

        if (dEl) dEl.textContent = String(days).padStart(2, '0');
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(mins).padStart(2, '0');
        if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// User Perspective Selector
function renderUserSelector() {
    const select = document.getElementById('active-user-select');
    const avatar = document.getElementById('current-user-avatar');
    if (!select || !avatar) return;

    select.innerHTML = '';
    state.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.name} (${student.primaryRole.split(' ')[0]})`;
        if (student.id === state.currentUserId) option.selected = true;
        select.appendChild(option);
    });

    const current = state.getCurrentUser();
    avatar.src = current.avatar;
    avatar.title = `${current.name} - ${current.primaryRole}`;
}

// Tab Navigation
function setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetView = tab.getAttribute('data-view');
            switchView(targetView);
            sfx.play('click');
        });
    });

    // Brand click returns to projects
    const brand = document.getElementById('brand-home');
    if (brand) {
        brand.addEventListener('click', () => switchView('projects'));
    }
}

function switchView(viewName) {
    state.activeView = viewName;
    document.querySelectorAll('.nav-tab').forEach(t => {
        if (t.getAttribute('data-view') === viewName) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });

    document.querySelectorAll('.view-panel').forEach(panel => {
        if (panel.id === `view-${viewName}`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    if (viewName === 'projects') renderProjects();
    if (viewName === 'students') renderStudents();
    if (viewName === 'matchmaker') renderMatchmaker();
    if (viewName === 'copilot') renderCopilot();
    if (viewName === 'applications') renderRequests();
    if (viewName === 'chat') renderChat();
}

function updateSoundIcon() {
    const onIcon = document.getElementById('icon-sound-on');
    const offIcon = document.getElementById('icon-sound-off');
    if (!onIcon || !offIcon) return;
    if (sfx.enabled) {
        onIcon.style.display = 'block';
        offIcon.style.display = 'none';
    } else {
        onIcon.style.display = 'none';
        offIcon.style.display = 'block';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Switch User Perspective
    const userSelect = document.getElementById('active-user-select');
    if (userSelect) {
        userSelect.addEventListener('change', (e) => {
            state.currentUserId = e.target.value;
            state.save();
            renderUserSelector();
            showToast(`Switched perspective to ${state.getCurrentUser().name}`);
            updateBadges();
            renderAllViews();
        });
    }

    // Reset Data
    const btnReset = document.getElementById('btn-reset-data');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm('Reset HackerThorne to default mock data?')) {
                state.reset();
                renderUserSelector();
                updateBadges();
                renderAllViews();
                showToast('All demo data restored to initial state');
            }
        });
    }

    // Audio FX Toggle
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
        btnSound.addEventListener('click', () => {
            const enabled = sfx.toggle();
            updateSoundIcon();
            showToast(enabled ? 'Sound FX Enabled' : 'Sound FX Muted', 'info');
        });
    }

    // Keyboard Help Modal
    const btnHelp = document.getElementById('btn-keyboard-help');
    const keyboardModal = document.getElementById('keyboard-modal');
    const btnCloseKeyboard = document.getElementById('btn-close-keyboard-modal');
    if (btnHelp && keyboardModal) {
        btnHelp.addEventListener('click', () => keyboardModal.style.display = 'flex');
        if (btnCloseKeyboard) btnCloseKeyboard.addEventListener('click', () => keyboardModal.style.display = 'none');
    }

    // Theme Accent Dots
    document.querySelectorAll('.accent-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const accent = dot.getAttribute('data-accent');
            applyThemeAccent(accent);
            sfx.play('click');
        });
    });

    // Keyboard Shortcuts Global Handler
    window.addEventListener('keydown', (e) => {
        // Ignore if focus is in an input or textarea
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            if (e.key === 'Escape') {
                document.activeElement.blur();
            }
            return;
        }

        if (e.key === '1') switchView('projects');
        else if (e.key === '2') switchView('students');
        else if (e.key === '3') switchView('matchmaker');
        else if (e.key === '4') switchView('copilot');
        else if (e.key === '5') switchView('applications');
        else if (e.key === '6') switchView('chat');
        else if (e.key === '/') {
            e.preventDefault();
            const searchInput = state.activeView === 'students' 
                ? document.getElementById('student-search-input') 
                : document.getElementById('project-search-input');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        } else if (e.key === '?') {
            if (keyboardModal) keyboardModal.style.display = 'flex';
        } else if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Project Search and Filters (Debounced)
    const pSearch = document.getElementById('project-search-input');
    const pClear = document.getElementById('btn-clear-project-search');
    if (pSearch) {
        pSearch.addEventListener('input', debounce(() => {
            if (pClear) pClear.style.display = pSearch.value ? 'block' : 'none';
            renderProjects();
        }, 150));
    }
    if (pClear) {
        pClear.addEventListener('click', () => {
            pSearch.value = '';
            pClear.style.display = 'none';
            renderProjects();
            pSearch.focus();
        });
    }

    const pHackathon = document.getElementById('project-hackathon-filter');
    const pRole = document.getElementById('project-role-filter');
    if (pHackathon) pHackathon.addEventListener('change', renderProjects);
    if (pRole) pRole.addEventListener('change', renderProjects);

    // Cyber Dropdown Toggle
    const filterToggleBtn = document.getElementById('btn-filter-toggle');
    const filterDropdownMenu = document.getElementById('cyber-dropdown-menu');
    if (filterToggleBtn && filterDropdownMenu) {
        filterToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterDropdownMenu.classList.toggle('open');
            sfx.play('click');
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!filterDropdownMenu.contains(e.target) && !filterToggleBtn.contains(e.target)) {
                filterDropdownMenu.classList.remove('open');
            }
        });
    }


    // Project Quick Filter Chips
    document.querySelectorAll('[data-project-filter]').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('[data-project-filter]').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.projectFilter = chip.getAttribute('data-project-filter');
            sfx.play('click');
            renderProjects();
        });
    });

    // Project Sort Buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sortType = btn.getAttribute('data-sort');
            if (state.projectSort === sortType) {
                state.projectSortDesc = !state.projectSortDesc;
            } else {
                state.projectSort = sortType;
                state.projectSortDesc = true;
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
            
            // Update direction icon
            const icon = btn.querySelector('.sort-dir-icon');
            if (icon) {
                btn.classList.toggle('sort-desc', state.projectSortDesc);
                icon.textContent = state.projectSortDesc ? '↓' : '↑';
            }
            
            sfx.play('click');
            renderProjects();
        });
    });

    // Interactive Ticker Click to filter Hackathon
    document.querySelectorAll('.ticker-card[data-filter-hackathon]').forEach(card => {
        card.addEventListener('click', () => {
            const hackathon = card.getAttribute('data-filter-hackathon');
            if (pHackathon) {
                pHackathon.value = hackathon;
                switchView('projects');
                renderProjects();
                showToast(`Filtered projects for ${hackathon}`);
            }
        });
    });

    // Student Search and Filters (Debounced)
    const sSearch = document.getElementById('student-search-input');
    const sClear = document.getElementById('btn-clear-student-search');
    if (sSearch) {
        sSearch.addEventListener('input', debounce(() => {
            if (sClear) sClear.style.display = sSearch.value ? 'block' : 'none';
            renderStudents();
        }, 150));
    }
    if (sClear) {
        sClear.addEventListener('click', () => {
            sSearch.value = '';
            sClear.style.display = 'none';
            renderStudents();
            sSearch.focus();
        });
    }

    const sRole = document.getElementById('student-role-filter');
    const sExp = document.getElementById('student-exp-filter');
    if (sRole) sRole.addEventListener('change', renderStudents);
    if (sExp) sExp.addEventListener('change', renderStudents);

    // Student Quick Chips
    document.querySelectorAll('[data-student-filter]').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('[data-student-filter]').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.studentFilter = chip.getAttribute('data-student-filter');
            sfx.play('click');
            renderStudents();
        });
    });

    // Create Project Modal
    const btnOpenCreate = document.getElementById('btn-open-create-project');
    const createModal = document.getElementById('create-project-modal');
    const btnCloseCreate = document.getElementById('btn-close-create-modal');
    const btnCancelCreate = document.getElementById('btn-cancel-create');
    const createForm = document.getElementById('create-project-form');

    if (btnOpenCreate && createModal) {
        btnOpenCreate.addEventListener('click', () => createModal.style.display = 'flex');
        if (btnCloseCreate) btnCloseCreate.addEventListener('click', () => createModal.style.display = 'none');
        if (btnCancelCreate) btnCancelCreate.addEventListener('click', () => createModal.style.display = 'none');
        if (createForm) createForm.addEventListener('submit', handleCreateProject);
    }

    // Project Detail Modal Close
    const btnCloseProject = document.getElementById('btn-close-project-modal');
    const projectModal = document.getElementById('project-detail-modal');
    if (btnCloseProject && projectModal) {
        btnCloseProject.addEventListener('click', () => projectModal.style.display = 'none');
    }

    // Candidate Dossier Modal Close
    const candidateModal = document.getElementById('candidate-modal');
    const btnCloseCandidate = document.getElementById('btn-close-candidate-modal');
    if (btnCloseCandidate && candidateModal) {
        btnCloseCandidate.addEventListener('click', () => candidateModal.style.display = 'none');
    }

    // Apply Modal Close & Submit
    const applyModal = document.getElementById('apply-modal');
    const btnCloseApply = document.getElementById('btn-close-apply-modal');
    const btnCancelApply = document.getElementById('btn-cancel-apply');
    const applyForm = document.getElementById('apply-form');
    if (applyModal) {
        if (btnCloseApply) btnCloseApply.addEventListener('click', () => applyModal.style.display = 'none');
        if (btnCancelApply) btnCancelApply.addEventListener('click', () => applyModal.style.display = 'none');
        if (applyForm) applyForm.addEventListener('submit', handleApplySubmit);
    }

    // Squad Hub Modal Subtabs
    document.querySelectorAll('.hub-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-hub-tab');
            state.hubActiveTab = tabName;
            document.querySelectorAll('.hub-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sfx.play('click');
            if (currentSelectedProjectId) {
                renderProjectHubContent(currentSelectedProjectId);
            }
        });
    });

    // Matchmaker Controls
    const btnRunMatchmaker = document.getElementById('btn-run-matchmaker');
    const matchmakerSelect = document.getElementById('matchmaker-project-select');
    if (btnRunMatchmaker) btnRunMatchmaker.addEventListener('click', runSquadMatchmaker);
    if (matchmakerSelect) matchmakerSelect.addEventListener('change', runSquadMatchmaker);

    // AI Copilot Controls
    const copilotTrackSelect = document.getElementById('copilot-track-select');
    const btnRandomIdea = document.getElementById('btn-generate-custom-idea');
    if (copilotTrackSelect) copilotTrackSelect.addEventListener('change', renderCopilot);
    if (btnRandomIdea) {
        btnRandomIdea.addEventListener('click', () => {
            sfx.play('pop');
            const tracks = ['AI & Education', 'HealthTech & Social Impact', 'Web3 & Digital Identity', 'Sustainability & Climate'];
            const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
            if (copilotTrackSelect) copilotTrackSelect.value = randomTrack;
            renderCopilot();
            showToast(`Generated concept for track: ${randomTrack}`);
        });
    }

    // Inbox Subtabs
    const subIncoming = document.getElementById('subtab-incoming');
    const subOutgoing = document.getElementById('subtab-outgoing');
    if (subIncoming && subOutgoing) {
        subIncoming.addEventListener('click', () => {
            state.inboxSubtab = 'incoming';
            subIncoming.classList.add('active');
            subOutgoing.classList.remove('active');
            sfx.play('click');
            renderRequests();
        });
        subOutgoing.addEventListener('click', () => {
            state.inboxSubtab = 'outgoing';
            subOutgoing.classList.add('active');
            subIncoming.classList.remove('active');
            sfx.play('click');
            renderRequests();
        });
    }

    // Chat Message Submit & Slash shortcuts
    const chatForm = document.getElementById('chat-form');
    if (chatForm) chatForm.addEventListener('submit', handleSendMessage);

    document.querySelectorAll('.slash-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.value = cmd;
                chatInput.focus();
            }
        });
    });

    const btnQuickStandup = document.getElementById('btn-quick-standup');
    if (btnQuickStandup) {
        btnQuickStandup.addEventListener('click', () => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) {
                chatInput.value = '/standup';
                chatInput.focus();
            }
        });
    }

    // Close modals when clicking backdrop
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.style.display = 'none');
}

function updateBadges() {
    const user = state.getCurrentUser();
    const myProjects = state.projects.filter(p => p.creatorId === user.id);
    const myProjectIds = myProjects.map(p => p.id);

    const pendingIncoming = state.requests.filter(r => 
        (r.recipientId === user.id || myProjectIds.includes(r.projectId)) &&
        r.status === 'pending' &&
        r.senderId !== user.id
    );

    const pendingOutgoing = state.requests.filter(r =>
        r.senderId === user.id && r.status === 'pending'
    );

    const bookmarkedStudents = state.students.filter(s => s.bookmarked);

    const incBadge = document.getElementById('incoming-count');
    const outBadge = document.getElementById('outgoing-count');
    const inboxBadge = document.getElementById('inbox-badge-count');
    const bookmarkBadge = document.getElementById('bookmark-count-badge');

    if (incBadge) incBadge.textContent = pendingIncoming.length;
    if (outBadge) outBadge.textContent = pendingOutgoing.length;
    if (bookmarkBadge) bookmarkBadge.textContent = bookmarkedStudents.length;

    if (inboxBadge) {
        inboxBadge.textContent = pendingIncoming.length;
        inboxBadge.style.display = pendingIncoming.length > 0 ? 'inline-block' : 'none';
    }
}

function renderAllViews() {
    renderProjects();
    renderStudents();
    renderMatchmaker();
    renderCopilot();
    renderRequests();
    renderChat();
}

// ==========================================
// 1. PROJECTS VIEW & SQUAD VISUALIZER
// ==========================================
function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    const searchInput = document.getElementById('project-search-input');
    const hackathonFilter = document.getElementById('project-hackathon-filter');
    const roleFilter = document.getElementById('project-role-filter');

    const searchTerm = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const selectedHackathon = hackathonFilter ? hackathonFilter.value : 'all';
    const selectedRole = roleFilter ? roleFilter.value : 'all';
    const currentUser = state.getCurrentUser();

    const filtered = state.projects.filter(project => {
        if (selectedHackathon !== 'all' && project.hackathon !== selectedHackathon) return false;
        
        const filledRoles = project.members.map(m => m.assignedRole);
        const missingRoles = project.requiredSquadRoles.filter(r => !filledRoles.includes(r));
        if (selectedRole !== 'all' && !missingRoles.includes(selectedRole)) return false;

        // Quick filter pills
        if (state.projectFilter === 'my-squads') {
            const isMyProject = project.creatorId === currentUser.id || project.members.some(m => m.userId === currentUser.id);
            if (!isMyProject) return false;
        } else if (state.projectFilter === 'needs-roles') {
            if (missingRoles.length === 0) return false;
        } else if (state.projectFilter === 'high-match') {
            const score = calculateMatchScore(currentUser, project);
            if (score < 85) return false;
        } else if (state.projectFilter === 'squad-full') {
            if (missingRoles.length > 0) return false;
        }

        // Search match
        if (searchTerm) {
            const matchTitle = project.title.toLowerCase().includes(searchTerm);
            const matchDesc = project.description.toLowerCase().includes(searchTerm);
            const matchSkills = (project.requiredSkills || []).some(s => s.toLowerCase().includes(searchTerm));
            if (!matchTitle && !matchDesc && !matchSkills) return false;
        }

        return true;
    });

    // Calculate Counts for Filter Chips
    const counts = {
        'all': state.projects.length,
        'my-squads': state.projects.filter(p => p.creatorId === currentUser.id || p.members.some(m => m.userId === currentUser.id)).length,
        'needs-roles': state.projects.filter(p => p.requiredSquadRoles.length > p.members.length).length,
        'high-match': state.projects.filter(p => calculateMatchScore(currentUser, p) >= 85).length,
        'squad-full': state.projects.filter(p => p.requiredSquadRoles.length <= p.members.length).length
    };
    
    // Update chip count DOM
    for (const [key, count] of Object.entries(counts)) {
        const el = document.getElementById(`pf-count-${key}`);
        if (el) el.textContent = count;
    }

    // Apply Sorting
    filtered.sort((a, b) => {
        let valA, valB;
        if (state.projectSort === 'match') {
            valA = calculateMatchScore(currentUser, a);
            valB = calculateMatchScore(currentUser, b);
        } else if (state.projectSort === 'newest') {
            valA = parseInt(a.id.replace('proj-', '')) || 0;
            valB = parseInt(b.id.replace('proj-', '')) || 0;
        } else if (state.projectSort === 'progress') {
            const progA = a.tasks && a.tasks.length > 0 ? (a.tasks.filter(t => t.status === 'done' || t.status === 'completed').length / a.tasks.length) : 0;
            const progB = b.tasks && b.tasks.length > 0 ? (b.tasks.filter(t => t.status === 'done' || t.status === 'completed').length / b.tasks.length) : 0;
            valA = progA;
            valB = progB;
        } else if (state.projectSort === 'squad-size') {
            valA = a.members.length / Math.max(a.requiredSquadRoles.length, 1);
            valB = b.members.length / Math.max(b.requiredSquadRoles.length, 1);
        }
        
        if (valA === valB) return 0;
        return state.projectSortDesc ? (valA < valB ? 1 : -1) : (valA > valB ? 1 : -1);
    });

    // Render Results Summary Bar
    const resultsBar = document.getElementById('projects-results-bar');
    if (resultsBar) {
        let activeFiltersHtml = '';
        if (selectedHackathon !== 'all') activeFiltersHtml += `<span class="active-filter-tag">${escapeHtml(selectedHackathon)}</span>`;
        if (selectedRole !== 'all') activeFiltersHtml += `<span class="active-filter-tag">Role: ${escapeHtml(selectedRole)}</span>`;
        if (state.projectFilter !== 'all') {
            const filterMap = {'my-squads': 'My Squads', 'needs-roles': 'Recruiting', 'high-match': 'High Match', 'squad-full': 'Squad Full'};
            activeFiltersHtml += `<span class="active-filter-tag">${filterMap[state.projectFilter] || state.projectFilter}</span>`;
        }
        if (searchTerm) activeFiltersHtml += `<span class="active-filter-tag">"${escapeHtml(searchTerm)}"</span>`;
        
        if (activeFiltersHtml) {
            resultsBar.innerHTML = `
                <div class="results-count-text">Showing <strong>${filtered.length}</strong> matching squads</div>
                <div class="results-active-filters">
                    ${activeFiltersHtml}
                    <button class="btn-clear-all-filters" id="btn-clear-all-filters">Clear All</button>
                </div>
            `;
            resultsBar.style.display = 'flex';
            
            const clearAllBtn = document.getElementById('btn-clear-all-filters');
            if (clearAllBtn) {
                clearAllBtn.addEventListener('click', () => {
                    if (searchInput) searchInput.value = '';
                    if (hackathonFilter) hackathonFilter.value = 'all';
                    if (roleFilter) roleFilter.value = 'all';
                    state.projectFilter = 'all';
                    document.querySelectorAll('[data-project-filter]').forEach(c => c.classList.remove('active'));
                    const allChip = document.querySelector('[data-project-filter="all"]');
                    if (allChip) allChip.classList.add('active');
                    renderProjects();
                });
            }
        } else {
            resultsBar.innerHTML = `<div class="results-count-text">Showing all <strong>${filtered.length}</strong> squads</div>`;
            resultsBar.style.display = 'flex';
        }
    }

    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: rgba(0,0,0,0.25); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
                <span style="font-size:36px;">🔍</span>
                <p style="font-size: 16px; color: var(--text-muted); margin-top: 10px;">No projects found matching the selected criteria.</p>
                <button class="btn btn-secondary" style="margin-top: 14px;" id="btn-reset-proj-filters">Reset All Filters</button>
            </div>
        `;
        const resetBtn = document.getElementById('btn-reset-proj-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (hackathonFilter) hackathonFilter.value = 'all';
                if (roleFilter) roleFilter.value = 'all';
                state.projectFilter = 'all';
                document.querySelectorAll('[data-project-filter]').forEach(c => c.classList.remove('active'));
                const allChip = document.querySelector('[data-project-filter="all"]');
                if (allChip) allChip.classList.add('active');
                renderProjects();
            });
        }
        return;
    }

    filtered.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const filledRoles = project.members.map(m => m.assignedRole);
        const missingRoles = project.requiredSquadRoles.filter(r => !filledRoles.includes(r));
        const isMember = project.members.some(m => m.userId === currentUser.id);
        const matchScore = calculateMatchScore(currentUser, project);

        // Sprint progress
        const totalTasks = project.tasks ? project.tasks.length : 0;
        const completedTasks = project.tasks ? project.tasks.filter(t => t.status === 'done' || t.status === 'completed').length : 0;
        const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Squad Slots HTML
        let squadSlotsHtml = '';
        project.requiredSquadRoles.forEach(role => {
            const member = project.members.find(m => m.assignedRole === role);
            if (member) {
                squadSlotsHtml += `
                    <div class="squad-slot" title="${escapeHtml(member.name)} (${escapeHtml(member.assignedRole)})">
                        <img class="slot-avatar" src="${member.avatar}" alt="${escapeHtml(member.name)}">
                        <span class="slot-role-lbl">${escapeHtml(member.assignedRole.split(' ')[0])}</span>
                    </div>
                `;
            } else {
                squadSlotsHtml += `
                    <div class="squad-slot slot-clickable" title="Needed: ${escapeHtml(role)}" data-action="open-hub" data-id="${project.id}">
                        <div class="slot-empty">+</div>
                        <span class="slot-role-lbl slot-empty-lbl">${escapeHtml(role.split(' ')[0])}</span>
                    </div>
                `;
            }
        });

        // Skills HTML
        const skillsHtml = (project.requiredSkills || []).slice(0, 4).map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');

        card.innerHTML = `
            <div>
                <div class="project-card-header">
                    <div>
                        <div class="project-meta-badges">
                            <span class="badge badge-purple">${escapeHtml(project.hackathon)}</span>
                            <span class="badge badge-cyan">${escapeHtml(project.track)}</span>
                            <span class="badge badge-emerald">${escapeHtml(project.timeCommitment)}</span>
                        </div>
                        <h3 class="project-title">${escapeHtml(project.title)}</h3>
                        <p class="project-tagline">${escapeHtml(project.tagline)}</p>
                    </div>
                </div>

                <div class="squad-visualizer" style="margin-top: 14px;">
                    <div class="squad-vis-title">
                        <span>Squad Formation (${project.members.length}/${project.requiredSquadRoles.length})</span>
                        <span style="color: ${missingRoles.length > 0 ? '#06b6d4' : '#10b981'}; font-weight: 700;">
                            ${missingRoles.length > 0 ? `${missingRoles.length} Open Role${missingRoles.length > 1 ? 's' : ''}` : 'Squad Full'}
                        </span>
                    </div>
                    <div class="squad-slots-row">
                        ${squadSlotsHtml}
                    </div>
                </div>

                <div style="margin-top: 14px;">
                    <div class="skills-tags">
                        ${skillsHtml}
                    </div>
                </div>
            </div>

            <div class="project-card-footer">
                <div class="progress-mini">
                    <span class="progress-text">Sprint Velocity: ${completedTasks}/${totalTasks} Tasks (${progressPct}%)</span>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${progressPct}%;"></div>
                    </div>
                </div>

                <div class="project-actions">
                    <button class="btn btn-secondary" data-action="open-hub" data-id="${project.id}">
                        <span>Squad Hub</span>
                    </button>
                    ${!isMember ? `
                        <button class="btn btn-primary" data-action="open-apply" data-id="${project.id}">
                            <span>Apply (${matchScore}%)</span>
                        </button>
                    ` : `
                        <span class="badge badge-emerald" style="padding: 7px 11px;">Squad Member</span>
                    `}
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    // Delegate project card actions
    container.querySelectorAll('[data-action]').forEach(el => {
        el.addEventListener('click', (e) => {
            const action = el.getAttribute('data-action');
            const id = el.getAttribute('data-id');
            if (action === 'open-hub') window.openProjectModal(id);
            if (action === 'open-apply') window.openApplyModal(id);
        });
    });
}
window.renderProjects = renderProjects;

// Open Project Detail & Squad Hub Modal
window.openProjectModal = function(projectId) {
    currentSelectedProjectId = projectId;
    const project = state.getProjectById(projectId);
    if (!project) return;

    const modal = document.getElementById('project-detail-modal');
    const title = document.getElementById('modal-project-title');
    const hackathon = document.getElementById('modal-project-hackathon');
    const track = document.getElementById('modal-project-track');
    const status = document.getElementById('modal-project-status');

    if (title) title.textContent = project.title;
    if (hackathon) hackathon.textContent = project.hackathon;
    if (track) track.textContent = project.track;
    if (status) status.textContent = project.status || 'Active Sprint';

    renderProjectHubContent(projectId);
    if (modal) modal.style.display = 'flex';
    sfx.play('click');
};

// Render Hub Tab Content (Roster, Kanban, Rubric, Devpost)
function renderProjectHubContent(projectId) {
    const project = state.getProjectById(projectId);
    const body = document.getElementById('modal-project-body');
    if (!project || !body) return;

    const filledRoles = project.members.map(m => m.assignedRole);
    const missingRoles = project.requiredSquadRoles.filter(r => !filledRoles.includes(r));
    const currentUser = state.getCurrentUser();
    const isMember = project.members.some(m => m.userId === currentUser.id);

    if (state.hubActiveTab === 'roster') {
        // TAB 1: SQUAD ROSTER & AI MATCHES
        const membersHtml = project.members.map(member => {
            const studentInfo = state.getStudentById(member.userId);
            return `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:rgba(255,255,255,0.03); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <img src="${member.avatar}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid #8b5cf6;" alt="${escapeHtml(member.name)}">
                        <div>
                            <div style="font-weight:700; color:#fff; font-size:14px;">
                                ${escapeHtml(member.name)} ${member.isLeader ? '<span class="badge badge-purple" style="font-size:10px; margin-left:6px;">Squad Lead</span>' : ''}
                            </div>
                            <div style="font-size:12px; color:var(--text-muted);">${escapeHtml(member.assignedRole)} ${studentInfo ? `• ${escapeHtml(studentInfo.university)}` : ''}</div>
                        </div>
                    </div>
                    <button class="btn btn-secondary" style="padding:5px 10px; font-size:12px;" onclick="window.startDirectMessage('${member.userId}')">Chat</button>
                </div>
            `;
        }).join('');

        let missingRolesHtml = '';
        if (missingRoles.length === 0) {
            missingRolesHtml = `<p style="color:#10b981; font-weight:600; font-size:13.5px;">🎉 Squad is complete! All ${project.requiredSquadRoles.length} squad roles filled.</p>`;
        } else {
            missingRolesHtml = missingRoles.map(role => {
                const candidates = state.students
                    .filter(s => !project.members.some(m => m.userId === s.id))
                    .filter(s => s.primaryRole === role || (s.secondaryRoles && s.secondaryRoles.includes(role)))
                    .map(s => ({ student: s, score: calculateMatchScore(s, project) }))
                    .sort((a, b) => b.score - a.score);

                const topCandidate = candidates[0];

                return `
                    <div style="padding:12px; background:rgba(6, 182, 212, 0.04); border:1px dashed rgba(6, 182, 212, 0.3); border-radius:8px; display:flex; flex-direction:column; gap:8px;">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-weight:700; color:#22d3ee; font-size:13px;">🚨 Needed: ${escapeHtml(role)}</span>
                            ${!isMember ? `
                                <button class="btn btn-primary" style="padding:4px 10px; font-size:11px;" onclick="window.openApplyModal('${project.id}', '${role}')">Apply for Role</button>
                            ` : ''}
                        </div>
                        ${topCandidate ? `
                            <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:rgba(0,0,0,0.3); border-radius:6px; font-size:12px;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <img src="${topCandidate.student.avatar}" style="width:26px; height:26px; border-radius:50%;" alt="${escapeHtml(topCandidate.student.name)}">
                                    <span>Top Pick: <strong>${escapeHtml(topCandidate.student.name)}</strong> (${escapeHtml(topCandidate.student.university)})</span>
                                    <span class="badge badge-emerald" style="font-size:10px;">${topCandidate.score}% Match</span>
                                </div>
                                <button class="btn btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="window.inviteCandidate('${project.id}', '${topCandidate.student.id}', '${role}')">Invite</button>
                            </div>
                        ` : '<span style="font-size:11.5px; color:var(--text-dim);">Scanning candidate directory...</span>'}
                    </div>
                `;
            }).join('');
        }

        body.innerHTML = `
            <div>
                <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px;">Project Overview & Concept</h4>
                <p style="color:var(--text-muted); font-size:14px; line-height:1.6;">${escapeHtml(project.description)}</p>
            </div>

            <div style="margin-top:16px;">
                <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px;">Current Squad Members (${project.members.length})</h4>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    ${membersHtml}
                </div>
            </div>

            <div style="margin-top:16px;">
                <h4 style="font-size:13px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px;">Open Positions & AI Recruits</h4>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${missingRolesHtml}
                </div>
            </div>
        `;
    } else if (state.hubActiveTab === 'kanban') {
        // TAB 2: INTERACTIVE SPRINT KANBAN BOARD
        const tasks = project.tasks || [];
        const cols = [
            { key: 'backlog', title: '📋 Backlog', icon: '📋' },
            { key: 'in_progress', title: '🔨 In Progress', icon: '🔨' },
            { key: 'review', title: '🧪 Review / Testing', icon: '🧪' },
            { key: 'done', title: '✅ Demo Ready', icon: '✅' }
        ];

        let kanbanColumnsHtml = cols.map(col => {
            const colTasks = tasks.filter(t => {
                if (col.key === 'done') return t.status === 'done' || t.status === 'completed';
                if (col.key === 'backlog') return t.status === 'backlog' || t.status === 'todo';
                return t.status === col.key;
            });

            const cardsHtml = colTasks.map(task => {
                const priorityClass = task.priority === 'urgent' ? 'priority-urgent' : task.priority === 'high' ? 'priority-high' : 'priority-medium';
                return `
                    <div class="kanban-card" id="task-${task.id}">
                        <div class="kanban-card-title">${escapeHtml(task.title)}</div>
                        <div class="kanban-meta-row">
                            <span class="${priorityClass}">${task.priority || 'medium'}</span>
                            <span style="font-size:11px; color:var(--text-dim);">${escapeHtml(task.assignee || 'Unassigned')}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                            <span style="font-size:10px; color:var(--accent-cyan); font-weight:600;">${escapeHtml(task.role || 'General')}</span>
                            <div class="kanban-nav-btns">
                                ${col.key !== 'backlog' ? `
                                    <button class="kanban-nav-btn" title="Move Left" onclick="window.moveTask('${project.id}', '${task.id}', 'left')">←</button>
                                ` : ''}
                                ${col.key !== 'done' ? `
                                    <button class="kanban-nav-btn" title="Move Right" onclick="window.moveTask('${project.id}', '${task.id}', 'right')">→</button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="kanban-col">
                    <div class="kanban-col-header">
                        <span class="kanban-col-title">${col.title}</span>
                        <span class="kanban-col-count">${colTasks.length}</span>
                    </div>
                    <div class="kanban-cards-list">
                        ${cardsHtml.length > 0 ? cardsHtml : '<div style="text-align:center; padding:20px; font-size:12px; color:var(--text-dim);">No tasks in this lane</div>'}
                    </div>
                </div>
            `;
        }).join('');

        body.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div>
                    <h4 style="font-size:15px; font-weight:700; color:#fff;">Hackathon Sprint Kanban Board</h4>
                    <p style="font-size:12px; color:var(--text-muted);">Track feature branches, wireframes, and pitch slides. Move tasks as your squad progresses.</p>
                </div>
            </div>

            <!-- Quick Add Task Bar -->
            <div class="new-task-form" style="background:rgba(0,0,0,0.3); padding:10px 14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); display:flex; gap:10px; flex-wrap:wrap;">
                <input type="text" id="new-task-title" class="new-task-input" placeholder="New sprint task description..." style="flex:2; min-width:200px;">
                <select id="new-task-role" class="filter-select" style="padding:6px 10px; font-size:12px;">
                    <option value="General">General</option>
                    ${project.requiredSquadRoles.map(r => `<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join('')}
                </select>
                <select id="new-task-priority" class="filter-select" style="padding:6px 10px; font-size:12px;">
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Priority</option>
                </select>
                <button class="btn btn-primary" style="padding:6px 16px; font-size:12px;" onclick="window.addNewKanbanTask('${project.id}')">Add Task</button>
            </div>

            <div class="kanban-board">
                ${kanbanColumnsHtml}
            </div>
        `;
    } else if (state.hubActiveTab === 'rubric') {
        // TAB 3: DEMO DAY RUBRIC & READINESS
        const rubric = computeJudgeRubric(project);

        body.innerHTML = `
            <div class="rubric-container">
                <div class="readiness-banner">
                    <div class="readiness-score-box">
                        <div class="score-circle">${rubric.overall}%</div>
                        <div>
                            <h3 style="font-size:18px; font-weight:800; color:#fff;">Demo Day Readiness Index</h3>
                            <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">
                                ${rubric.overall >= 85 ? '🌟 Exceptional! Your squad and prototype are primed to win.' : '⚡ Good progress! Follow AI judge recommendations below to hit 90%+ readiness.'}
                            </p>
                        </div>
                    </div>
                    <span class="badge ${rubric.overall >= 80 ? 'badge-emerald' : 'badge-amber'}" style="padding:8px 16px; font-size:13px; text-transform:uppercase;">
                        ${rubric.overall >= 85 ? 'Demo Ready' : 'In Sprint'}
                    </span>
                </div>

                <div class="rubric-grid">
                    <div class="rubric-card">
                        <div class="rubric-card-header">
                            <span style="font-weight:700; font-size:13.5px; color:#fff;">🛠 Technical Difficulty & MVP (30%)</span>
                            <span style="font-weight:700; color:#38bdf8;">${rubric.technical}%</span>
                        </div>
                        <div class="rubric-bar-bg">
                            <div class="rubric-bar-fill" style="width:${rubric.technical}%; background:linear-gradient(90deg, #38bdf8, #6366f1);"></div>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); margin-top:4px;">Backend APIs, schema models, and working client integration.</p>
                    </div>

                    <div class="rubric-card">
                        <div class="rubric-card-header">
                            <span style="font-weight:700; font-size:13.5px; color:#fff;">🎨 UI/UX Polish & Usability (25%)</span>
                            <span style="font-weight:700; color:#a855f7;">${rubric.design}%</span>
                        </div>
                        <div class="rubric-bar-bg">
                            <div class="rubric-bar-fill" style="width:${rubric.design}%; background:linear-gradient(90deg, #a855f7, #ec4899);"></div>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); margin-top:4px;">High-fidelity wireframes, intuitive ergonomics, and design system.</p>
                    </div>

                    <div class="rubric-card">
                        <div class="rubric-card-header">
                            <span style="font-weight:700; font-size:13.5px; color:#fff;">🎤 Pitch & Demo Storytelling (25%)</span>
                            <span style="font-weight:700; color:#10b981;">${rubric.pitch}%</span>
                        </div>
                        <div class="rubric-bar-bg">
                            <div class="rubric-bar-fill" style="width:${rubric.pitch}%; background:linear-gradient(90deg, #10b981, #06b6d4);"></div>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); margin-top:4px;">Compelling hook, live demo script, and market impact narrative.</p>
                    </div>

                    <div class="rubric-card">
                        <div class="rubric-card-header">
                            <span style="font-weight:700; font-size:13.5px; color:#fff;">👥 Squad Role Coverage (20%)</span>
                            <span style="font-weight:700; color:#f59e0b;">${rubric.squad}%</span>
                        </div>
                        <div class="rubric-bar-bg">
                            <div class="rubric-bar-fill" style="width:${rubric.squad}%; background:linear-gradient(90deg, #f59e0b, #f97316);"></div>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); margin-top:4px;">Full 5-role coverage ensures balanced team execution during judging.</p>
                    </div>
                </div>

                <div class="ai-advice-box">
                    <span style="font-weight:700; color:#a5b4fc; font-size:13.5px;">💡 AI Judge Advisory & Next Sprint Steps:</span>
                    <ul style="padding-left:18px; margin:0; display:flex; flex-direction:column; gap:6px; font-size:13px; color:#e2e8f0; line-height:1.5;">
                        ${rubric.advice.map(tip => `<li>${escapeHtml(tip)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    } else if (state.hubActiveTab === 'devpost') {
        // TAB 4: DEVPOST SUBMISSION EXPORT
        const draft = project.devpostDraft || {
            inspiration: `${project.tagline}. Built specifically for ${project.hackathon}.`,
            whatItDoes: project.description,
            howWeBuiltIt: `Built using ${(project.requiredSkills || []).join(', ')}.`,
            challenges: "Tight hackathon timeline and synchronizing team sprint tasks.",
            accomplishments: "Finished full working demo prototype with 5-person squad."
        };

        const markdownText = `# ${project.title}\n> ${project.tagline}\n\n**Hackathon Event:** ${project.hackathon}\n**Track:** ${project.track}\n**Squad Roster:** ${project.members.map(m => `${m.name} (${m.assignedRole})`).join(', ')}\n\n## 💡 Inspiration\n${draft.inspiration}\n\n## ⚙️ What it does\n${draft.whatItDoes}\n\n## 🛠 How we built it\n${draft.howWeBuiltIt}\n\n## 🧗 Challenges we ran into\n${draft.challenges}\n\n## 🏆 Accomplishments that we're proud of\n${draft.accomplishments}\n\n## 🚀 What's next for ${project.title}\nTaking feedback from ${project.hackathon} judges and preparing university pilot rollout!`;

        body.innerHTML = `
            <div class="devpost-export-container">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h4 style="font-size:15px; font-weight:700; color:#fff;">Devpost & Pitch Deck Markdown Export</h4>
                        <p style="font-size:12px; color:var(--text-muted);">Ready-to-paste markdown formatted for Devpost, GitHub README, or presentation speaker notes.</p>
                    </div>
                    <button class="btn btn-primary" id="btn-copy-devpost">
                        <span>📋 Copy to Clipboard</span>
                    </button>
                </div>

                <div class="devpost-preview-box" id="devpost-text-box">${escapeHtml(markdownText)}</div>
            </div>
        `;

        const btnCopy = document.getElementById('btn-copy-devpost');
        if (btnCopy) {
            btnCopy.addEventListener('click', () => {
                navigator.clipboard.writeText(markdownText).then(() => {
                    btnCopy.innerHTML = '<span>✓ Copied to Clipboard!</span>';
                    showToast('Devpost markdown copied to clipboard!');
                    sfx.play('success');
                    setTimeout(() => {
                        if (btnCopy) btnCopy.innerHTML = '<span>📋 Copy to Clipboard</span>';
                    }, 2500);
                }).catch(() => {
                    showToast('Failed to copy to clipboard', 'info');
                });
            });
        }
    }
}

// Kanban Task Management Functions
window.moveTask = function(projectId, taskId, direction) {
    const project = state.getProjectById(projectId);
    if (!project || !project.tasks) return;
    const task = project.tasks.find(t => t.id === taskId);
    if (!task) return;

    const stages = ['backlog', 'in_progress', 'review', 'done'];
    let currentStage = task.status;
    if (currentStage === 'todo') currentStage = 'backlog';
    if (currentStage === 'completed') currentStage = 'done';

    let index = stages.indexOf(currentStage);
    if (index === -1) index = 0;

    if (direction === 'right' && index < stages.length - 1) {
        task.status = stages[index + 1];
    } else if (direction === 'left' && index > 0) {
        task.status = stages[index - 1];
    }

    state.save();
    sfx.play('task');
    renderProjectHubContent(projectId);
    renderProjects();
};

window.addNewKanbanTask = function(projectId) {
    const project = state.getProjectById(projectId);
    const titleInput = document.getElementById('new-task-title');
    const roleSelect = document.getElementById('new-task-role');
    const prioritySelect = document.getElementById('new-task-priority');

    if (!project || !titleInput || !titleInput.value.trim()) return;
    if (!project.tasks) project.tasks = [];

    const newTask = {
        id: `t-${Date.now()}`,
        title: titleInput.value.trim(),
        status: 'backlog',
        priority: prioritySelect ? prioritySelect.value : 'medium',
        role: roleSelect ? roleSelect.value : 'General',
        assignee: 'Unassigned'
    };

    project.tasks.push(newTask);
    state.save();
    sfx.play('success');
    showToast(`Task added to Backlog: ${newTask.title}`);
    renderProjectHubContent(projectId);
    renderProjects();
};

// ==========================================
// 2. TALENT NETWORK / STUDENTS VIEW
// ==========================================
function renderStudents() {
    const container = document.getElementById('students-container');
    if (!container) return;

    const searchInput = document.getElementById('student-search-input');
    const roleFilter = document.getElementById('student-role-filter');
    const expFilter = document.getElementById('student-exp-filter');

    const searchTerm = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const selectedRole = roleFilter ? roleFilter.value : 'all';
    const selectedExp = expFilter ? expFilter.value : 'all';

    const currentUser = state.getCurrentUser();
    const activeProject = state.projects[0];

    const filtered = state.students.filter(student => {
        if (selectedRole !== 'all' && student.primaryRole !== selectedRole && (!student.secondaryRoles || !student.secondaryRoles.includes(selectedRole))) {
            return false;
        }
        if (selectedExp !== 'all' && student.experience !== selectedExp) return false;

        // Quick chips
        if (state.studentFilter === 'bookmarked') {
            if (!student.bookmarked) return false;
        } else if (state.studentFilter === 'advanced') {
            if (student.experience !== 'Advanced') return false;
        } else if (state.studentFilter === 'high-synergy') {
            const score = calculateMatchScore(student, activeProject);
            if (score < 88) return false;
        }

        // Search match
        if (searchTerm) {
            const matchName = student.name.toLowerCase().includes(searchTerm);
            const matchUniv = student.university.toLowerCase().includes(searchTerm);
            const matchMajor = student.major.toLowerCase().includes(searchTerm);
            const matchSkills = (student.skills || []).some(s => s.toLowerCase().includes(searchTerm));
            if (!matchName && !matchUniv && !matchMajor && !matchSkills) return false;
        }

        return true;
    });

    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: rgba(0,0,0,0.25); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
                <span style="font-size:36px;">👥</span>
                <p style="font-size: 16px; color: var(--text-muted); margin-top: 10px;">No student talent matches the selected filters.</p>
                <button class="btn btn-secondary" style="margin-top: 14px;" id="btn-reset-stud-filters">Clear Talent Filters</button>
            </div>
        `;
        const resetBtn = document.getElementById('btn-reset-stud-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (roleFilter) roleFilter.value = 'all';
                if (expFilter) expFilter.value = 'all';
                state.studentFilter = 'all';
                document.querySelectorAll('[data-student-filter]').forEach(c => c.classList.remove('active'));
                const allChip = document.querySelector('[data-student-filter="all"]');
                if (allChip) allChip.classList.add('active');
                renderStudents();
            });
        }
        return;
    }

    filtered.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';

        const matchScore = calculateMatchScore(student, activeProject);
        const isSelf = student.id === currentUser.id;

        const skillsHtml = (student.skills || []).slice(0, 5).map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');
        const achievementsHtml = (student.hackathonHistory || []).map(h => `
            <div class="achievement-item">
                <span>🏆</span>
                <span><strong>${escapeHtml(h.event)}:</strong> ${escapeHtml(h.achievement)}</span>
            </div>
        `).join('');

        card.innerHTML = `
            <div>
                <div class="student-top">
                    <img class="student-avatar" src="${student.avatar}" alt="${escapeHtml(student.name)}" data-action="view-dossier" data-id="${student.id}" style="cursor:pointer;" title="View Dossier">
                    <div class="student-info">
                        <div class="student-name-row">
                            <h3 class="student-name" data-action="view-dossier" data-id="${student.id}" style="cursor:pointer;" title="View Dossier">${escapeHtml(student.name)}</h3>
                            <div style="display:flex; align-items:center; gap:6px;">
                                <button class="btn-bookmark ${student.bookmarked ? 'bookmarked' : ''}" data-action="toggle-bookmark" data-id="${student.id}" title="${student.bookmarked ? 'Remove from shortlist' : 'Shortlist candidate'}">★</button>
                                <span class="match-score-pill">
                                    <span>⚡</span> ${matchScore}% Synergy
                                </span>
                            </div>
                        </div>
                        <div class="student-univ">${escapeHtml(student.university)} • ${escapeHtml(student.year)}</div>
                        <div class="student-major">${escapeHtml(student.major)}</div>
                    </div>
                </div>

                <div style="margin-top: 12px;">
                    <div class="roles-row">
                        <span class="role-badge-primary">${escapeHtml(student.primaryRole)}</span>
                        ${(student.secondaryRoles || []).map(r => `<span class="role-badge-secondary">${escapeHtml(r)}</span>`).join('')}
                    </div>
                </div>

                <p class="student-bio" style="margin-top: 10px;">${escapeHtml(student.bio)}</p>

                <div style="margin-top: 12px;">
                    <div class="skills-tags">
                        ${skillsHtml}
                    </div>
                </div>

                ${achievementsHtml ? `
                    <div style="margin-top: 12px;">
                        <div class="achievement-list">
                            ${achievementsHtml}
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="project-card-footer" style="padding-top: 14px;">
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:11px; color:var(--text-dim);">Weekly Availability</span>
                    <span style="font-size:12px; font-weight:600; color:#34d399;">${escapeHtml(student.availability)}</span>
                </div>

                <div style="display:flex; gap:8px;">
                    <button class="btn btn-secondary" data-action="view-dossier" data-id="${student.id}">
                        <span>Dossier</span>
                    </button>
                    ${!isSelf ? `
                        <button class="btn btn-secondary" data-action="message-student" data-id="${student.id}">
                            <span>Chat</span>
                        </button>
                        <button class="btn btn-primary" data-action="invite-student" data-id="${student.id}">
                            <span>Invite</span>
                        </button>
                    ` : `
                        <span class="badge badge-purple" style="padding:7px 10px;">Acting User</span>
                    `}
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    // Delegate actions
    container.querySelectorAll('[data-action]').forEach(el => {
        el.addEventListener('click', (e) => {
            const action = el.getAttribute('data-action');
            const id = el.getAttribute('data-id');
            if (action === 'view-dossier') window.openCandidateDossier(id);
            if (action === 'toggle-bookmark') {
                e.stopPropagation();
                window.toggleStudentBookmark(id);
            }
            if (action === 'message-student') window.startDirectMessage(id);
            if (action === 'invite-student') window.openInviteModal(id);
        });
    });
}
window.renderStudents = renderStudents;

// Toggle Student Bookmark
window.toggleStudentBookmark = function(studentId) {
    const student = state.getStudentById(studentId);
    if (!student) return;
    student.bookmarked = !student.bookmarked;
    state.save();
    sfx.play('click');
    updateBadges();
    renderStudents();
    showToast(student.bookmarked ? `Added ${student.name} to shortlist` : `Removed ${student.name} from shortlist`, 'info');
};

// Candidate Dossier Modal
window.openCandidateDossier = function(studentId) {
    const student = state.getStudentById(studentId);
    if (!student) return;

    const modal = document.getElementById('candidate-modal');
    const body = document.getElementById('candidate-modal-body');
    const title = document.getElementById('candidate-modal-title');
    if (!modal || !body) return;

    if (title) title.textContent = `${student.name} — Talent Dossier`;

    const activeProject = state.projects[0];
    const matchScore = calculateMatchScore(student, activeProject);

    const trophiesHtml = (student.hackathonHistory || []).map(h => `
        <div style="display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.03); padding:10px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.06);">
            <span style="font-size:20px;">🏆</span>
            <div>
                <div style="font-weight:700; color:#fff; font-size:13.5px;">${escapeHtml(h.achievement)}</div>
                <div style="font-size:11.5px; color:var(--text-dim);">${escapeHtml(h.event)}</div>
            </div>
        </div>
    `).join('');

    body.innerHTML = `
        <div class="dossier-top">
            <img class="dossier-avatar" src="${student.avatar}" alt="${escapeHtml(student.name)}">
            <div class="dossier-details">
                <div style="display:flex; align-items:center; gap:10px;">
                    <h3 class="dossier-name">${escapeHtml(student.name)}</h3>
                    <span class="badge badge-emerald">⚡ ${matchScore}% Synergy Match</span>
                </div>
                <div style="font-size:14px; color:#38bdf8;">${escapeHtml(student.university)} • ${escapeHtml(student.year)}</div>
                <div style="font-size:13px; color:var(--text-muted);">${escapeHtml(student.major)}</div>
                <div class="dossier-links">
                    ${student.github ? `<a href="https://${student.github}" target="_blank" class="dossier-link-chip">🐙 ${student.github}</a>` : ''}
                    ${student.portfolio ? `<a href="https://${student.portfolio}" target="_blank" class="dossier-link-chip">🌐 ${student.portfolio}</a>` : ''}
                    ${student.discord ? `<span class="dossier-link-chip" style="color:#a5b4fc;">💬 ${student.discord}</span>` : ''}
                </div>
            </div>
        </div>

        <div style="margin-top:18px;">
            <h4 style="font-size:12.5px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px;">Biography & Mission</h4>
            <p style="font-size:14px; color:#e2e8f0; line-height:1.6;">${escapeHtml(student.bio)}</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-top:16px;">
            <div style="background:rgba(0,0,0,0.25); padding:12px 16px; border-radius:8px; border:1px solid var(--border-subtle);">
                <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; font-weight:700;">Working Style</div>
                <div style="font-size:13.5px; font-weight:600; color:#fff; margin-top:2px;">${escapeHtml(student.workingStyle || 'Collaborative Sprint Hacker')}</div>
            </div>
            <div style="background:rgba(0,0,0,0.25); padding:12px 16px; border-radius:8px; border:1px solid var(--border-subtle);">
                <div style="font-size:11px; color:var(--text-dim); text-transform:uppercase; font-weight:700;">Availability Commitment</div>
                <div style="font-size:13.5px; font-weight:600; color:#34d399; margin-top:2px;">${escapeHtml(student.availability)} (${escapeHtml(student.availabilityType || 'Hackathon Weekend')})</div>
            </div>
        </div>

        <div style="margin-top:18px;">
            <h4 style="font-size:12.5px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px;">Core Tech Stack & Verified Skills</h4>
            <div class="skills-tags">
                ${(student.skills || []).map(s => `<span class="skill-tag" style="padding:5px 12px; font-size:12px;">${escapeHtml(s)}</span>`).join('')}
            </div>
        </div>

        <div style="margin-top:18px;">
            <h4 style="font-size:12.5px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px;">Hackathon Trophies & Past Accolades</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
                ${trophiesHtml}
            </div>
        </div>

        <div class="modal-footer" style="margin-top:24px; padding-top:16px; border-top:1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('candidate-modal').style.display='none';">Close</button>
            <button type="button" class="btn btn-primary" onclick="document.getElementById('candidate-modal').style.display='none'; window.openInviteModal('${student.id}');">
                <span>⚡ Send Squad Invitation</span>
            </button>
        </div>
    `;

    modal.style.display = 'flex';
    sfx.play('click');
};

// ==========================================
// 3. AI SQUAD BUILDER (MATCHMAKER) VIEW
// ==========================================
function renderMatchmaker() {
    const select = document.getElementById('matchmaker-project-select');
    if (!select) return;

    select.innerHTML = '';
    state.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = `${project.title} (${project.hackathon})`;
        select.appendChild(option);
    });

    runSquadMatchmaker();
}

function runSquadMatchmaker() {
    const select = document.getElementById('matchmaker-project-select');
    const container = document.getElementById('matchmaker-results');
    if (!select || !container) return;

    const projectId = select.value || (state.projects[0] && state.projects[0].id);
    const project = state.getProjectById(projectId);
    if (!project) return;

    const assignedUserIds = project.members.map(m => m.userId);

    const rosterCards = project.requiredSquadRoles.map(role => {
        const existingMember = project.members.find(m => m.assignedRole === role);
        if (existingMember) {
            return `
                <div class="roster-card filled">
                    <span class="badge badge-purple" style="position:absolute; top:12px; left:12px;">Active Member</span>
                    <span class="roster-role-title">${escapeHtml(role)}</span>
                    <img class="roster-avatar" src="${existingMember.avatar}" alt="${escapeHtml(existingMember.name)}">
                    <div>
                        <h4 style="font-weight:700; color:#fff; font-size:15px;">${escapeHtml(existingMember.name)}</h4>
                        <span style="font-size:12px; color:var(--text-muted);">${existingMember.isLeader ? 'Squad Captain' : 'Confirmed Member'}</span>
                    </div>
                </div>
            `;
        } else {
            const availableCandidates = state.students
                .filter(s => !assignedUserIds.includes(s.id))
                .filter(s => s.primaryRole === role || (s.secondaryRoles && s.secondaryRoles.includes(role)))
                .map(s => ({ student: s, score: calculateMatchScore(s, project) }))
                .sort((a, b) => b.score - a.score);

            const match = availableCandidates[0];

            if (match) {
                return `
                    <div class="roster-card matched">
                        <span class="roster-match-score badge badge-emerald">⚡ ${match.score}% Synergy</span>
                        <span class="roster-role-title" style="color:#22d3ee;">Needed: ${escapeHtml(role)}</span>
                        <img class="roster-avatar" style="border-color:#10b981;" src="${match.student.avatar}" alt="${escapeHtml(match.student.name)}">
                        <div>
                            <h4 style="font-weight:700; color:#fff; font-size:15px;">${escapeHtml(match.student.name)}</h4>
                            <span style="font-size:12px; color:#38bdf8;">${escapeHtml(match.student.university)}</span>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); line-height:1.3;">
                            Key: ${(match.student.skills || []).slice(0, 3).join(', ')}
                        </p>
                        <button class="btn btn-primary" style="width:100%; padding:6px 12px; font-size:12px; margin-top:4px;" onclick="window.inviteCandidate('${project.id}', '${match.student.id}', '${role}')">
                            Send Squad Invite
                        </button>
                    </div>
                `;
            } else {
                return `
                    <div class="roster-card">
                        <span class="roster-role-title" style="color:var(--accent-amber);">Needed: ${escapeHtml(role)}</span>
                        <div class="slot-empty" style="width:68px; height:68px; font-size:24px;">?</div>
                        <div>
                            <h4 style="font-weight:700; color:#fff; font-size:14px;">Open Slot</h4>
                            <span style="font-size:12px; color:var(--text-muted);">No candidate in directory</span>
                        </div>
                    </div>
                `;
            }
        }
    }).join('');

    container.innerHTML = `
        <div style="background: rgba(0,0,0,0.3); padding: 18px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
                <h3 style="font-size: 18px; font-weight: 700; color: #fff;">${escapeHtml(project.title)} — Autonomous Squad Assembly</h3>
                <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
                    Targeting 5-role complete squad coverage with maximum skill compatibility for ${escapeHtml(project.hackathon)}.
                </p>
            </div>
            <button class="btn btn-primary" onclick="window.inviteAllRecommendations('${project.id}')">
                <span>⚡ 1-Click Invite All Missing Roles</span>
            </button>
        </div>

        <div class="roster-grid">
            ${rosterCards}
        </div>
    `;
}

// 1-Click Invite All Recommendations
window.inviteAllRecommendations = function(projectId) {
    const project = state.getProjectById(projectId);
    if (!project) return;
    const filledRoles = project.members.map(m => m.assignedRole);
    const missingRoles = project.requiredSquadRoles.filter(r => !filledRoles.includes(r));
    let invitedCount = 0;

    missingRoles.forEach(role => {
        const assignedUserIds = project.members.map(m => m.userId);
        const match = state.students
            .filter(s => !assignedUserIds.includes(s.id))
            .filter(s => s.primaryRole === role || (s.secondaryRoles && s.secondaryRoles.includes(role)))[0];

        if (match) {
            window.inviteCandidate(projectId, match.id, role, false);
            invitedCount++;
        }
    });

    sfx.play('success');
    showToast(`Sent ${invitedCount} squad invitations automatically!`);
    updateBadges();
    renderRequests();
};

// Invite Individual Candidate
window.inviteCandidate = function(projectId, studentId, role, showNotification = true) {
    const project = state.getProjectById(projectId);
    const student = state.getStudentById(studentId);
    const currentUser = state.getCurrentUser();
    if (!project || !student) return;

    const existing = state.requests.find(r => 
        r.projectId === projectId && r.recipientId === studentId && r.status === 'pending'
    );
    if (existing) {
        if (showNotification) showToast(`Invitation already pending for ${student.name}`, 'info');
        return;
    }

    const newRequest = {
        id: `req-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        projectId: project.id,
        projectTitle: project.title,
        senderId: currentUser.id,
        senderName: `${currentUser.name} (${project.title})`,
        senderAvatar: currentUser.avatar,
        senderRole: 'Squad Lead',
        targetRole: role,
        recipientId: student.id,
        type: 'invitation',
        status: 'pending',
        note: `Hi ${student.name}! We saw your incredible hackathon work and would love for you to join our squad as our ${role} for ${project.hackathon}!`,
        matchScore: calculateMatchScore(student, project),
        timestamp: 'Just now'
    };

    state.requests.unshift(newRequest);
    state.save();
    updateBadges();
    sfx.play('pop');
    if (showNotification) showToast(`Invitation sent to ${student.name} for ${role}!`);
};

// ==========================================
// 4. AI PITCH COPILOT & BLUEPRINTS (NEW VIEW)
// ==========================================
function renderCopilot() {
    const container = document.getElementById('blueprints-container');
    const trackSelect = document.getElementById('copilot-track-select');
    if (!container) return;

    const selectedTrack = trackSelect ? trackSelect.value : 'all';

    const filtered = PITCH_BLUEPRINTS.filter(bp => {
        if (selectedTrack !== 'all' && bp.track !== selectedTrack) return false;
        return true;
    });

    container.innerHTML = '';

    filtered.forEach(bp => {
        const card = document.createElement('div');
        card.className = 'blueprint-card';

        const skillsHtml = bp.techStack.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');
        const rolesHtml = bp.squadRoles.map(r => `<span class="role-badge-secondary">${escapeHtml(r)}</span>`).join('');

        card.innerHTML = `
            <div class="blueprint-header">
                <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="badge badge-purple">${escapeHtml(bp.hackathon)}</span>
                        <span class="badge badge-cyan">${escapeHtml(bp.track)}</span>
                    </div>
                    <h3 class="blueprint-title">${escapeHtml(bp.title)}</h3>
                    <p class="blueprint-tagline">${escapeHtml(bp.tagline)}</p>
                </div>
            </div>

            <div class="blueprint-section">
                <div class="blueprint-section-title">🚨 The Problem & Opportunity</div>
                <div class="blueprint-section-body">${escapeHtml(bp.problem)}</div>
            </div>

            <div class="blueprint-section">
                <div class="blueprint-section-title">💡 MVP Solution & Technical Architecture</div>
                <div class="blueprint-section-body">${escapeHtml(bp.solution)}</div>
            </div>

            <div class="blueprint-section">
                <div class="blueprint-section-title">🎤 3-Minute Demo Day Pitch Flow</div>
                <div class="blueprint-section-body">${escapeHtml(bp.demoScript)}</div>
            </div>

            <div style="display:flex; flex-direction:column; gap:6px;">
                <div style="font-size:11.5px; font-weight:700; color:var(--text-dim); text-transform:uppercase;">Recommended 5-Role Squad Matrix:</div>
                <div style="display:flex; flex-wrap:wrap; gap:6px;">
                    ${rolesHtml}
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:6px;">
                <div style="font-size:11.5px; font-weight:700; color:var(--text-dim); text-transform:uppercase;">Core Tech Stack:</div>
                <div class="skills-tags">
                    ${skillsHtml}
                </div>
            </div>

            <div style="padding-top:8px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; color:#10b981; font-weight:600;">✨ Judge Edge: ${escapeHtml(bp.winningEdge)}</span>
                <button class="btn btn-primary" onclick="window.launchFromBlueprint('${bp.id}')">
                    <span>🚀 Launch as Live Squad</span>
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}
window.renderCopilot = renderCopilot;

// 1-Click Launch Blueprint as a Real Project
window.launchFromBlueprint = function(blueprintId) {
    const bp = PITCH_BLUEPRINTS.find(b => b.id === blueprintId);
    if (!bp) return;

    const modal = document.getElementById('create-project-modal');
    if (!modal) return;

    document.getElementById('new-project-title').value = bp.title;
    document.getElementById('new-project-tagline').value = bp.tagline;
    document.getElementById('new-project-hackathon').value = bp.hackathon;
    document.getElementById('new-project-track').value = bp.track;
    document.getElementById('new-project-description').value = `${bp.problem}\n\nOur Solution:\n${bp.solution}`;
    document.getElementById('new-project-skills').value = bp.techStack.join(', ');

    modal.style.display = 'flex';
    sfx.play('click');
    showToast(`Loaded blueprint "${bp.title}". Review and publish!`);
};

// ==========================================
// 5. INBOX & APPLICATIONS VIEW
// ==========================================
function renderRequests() {
    const container = document.getElementById('requests-container');
    if (!container) return;

    const currentUser = state.getCurrentUser();
    const myProjects = state.projects.filter(p => p.creatorId === currentUser.id);
    const myProjectIds = myProjects.map(p => p.id);

    let requestsToDisplay = [];

    if (state.inboxSubtab === 'incoming') {
        requestsToDisplay = state.requests.filter(r => 
            (r.recipientId === currentUser.id || myProjectIds.includes(r.projectId)) &&
            r.senderId !== currentUser.id
        );
    } else {
        requestsToDisplay = state.requests.filter(r => r.senderId === currentUser.id);
    }

    container.innerHTML = '';

    if (requestsToDisplay.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 48px; background: rgba(0,0,0,0.25); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
                <span style="font-size:36px;">📬</span>
                <p style="font-size: 15px; color: var(--text-muted); margin-top:10px;">No ${state.inboxSubtab} requests at this time.</p>
            </div>
        `;
        return;
    }

    requestsToDisplay.forEach(req => {
        const card = document.createElement('div');
        card.className = 'request-card';

        const isPending = req.status === 'pending';
        const isIncoming = state.inboxSubtab === 'incoming';

        card.innerHTML = `
            <div class="request-left">
                <img class="request-avatar" src="${req.senderAvatar}" alt="${escapeHtml(req.senderName)}">
                <div class="request-details">
                    <div class="request-title-line">
                        <span class="request-sender-name">${escapeHtml(req.senderName)}</span>
                        <span class="badge badge-purple">${req.type === 'application' ? 'Application' : 'Team Invitation'}</span>
                        <span class="badge badge-cyan">Role: ${escapeHtml(req.targetRole)}</span>
                        <span class="badge badge-emerald">${req.matchScore}% Match</span>
                    </div>
                    <div class="request-meta">Project: <strong>${escapeHtml(req.projectTitle)}</strong> • Sent ${escapeHtml(req.timestamp)}</div>
                    <p class="request-note">"${escapeHtml(req.note)}"</p>
                </div>
            </div>

            <div class="request-actions">
                ${isPending && isIncoming ? `
                    <button class="btn btn-accept" onclick="window.acceptRequest('${req.id}')">Accept & Add to Squad</button>
                    <button class="btn btn-decline" onclick="window.declineRequest('${req.id}')">Decline</button>
                ` : `
                    <span class="badge ${req.status === 'accepted' ? 'badge-emerald' : req.status === 'declined' ? 'badge-rose' : 'badge-amber'}" style="padding: 6px 12px; font-size: 12px; text-transform: uppercase;">
                        ${req.status}
                    </span>
                `}
            </div>
        `;

        container.appendChild(card);
    });
}

// Accept Request
window.acceptRequest = function(requestId) {
    const req = state.requests.find(r => r.id === requestId);
    if (!req) return;

    const project = state.getProjectById(req.projectId);
    const applicant = state.getStudentById(req.senderId);

    if (project && applicant) {
        const alreadyMember = project.members.some(m => m.userId === applicant.id);
        if (!alreadyMember) {
            project.members.push({
                userId: applicant.id,
                name: applicant.name,
                avatar: applicant.avatar,
                assignedRole: req.targetRole,
                isLeader: false
            });
        }

        const teamChat = state.chats.find(c => c.targetId === project.id);
        if (teamChat) {
            teamChat.messages.push({
                id: `m-${Date.now()}`,
                senderId: 'system',
                senderName: 'HackerThorne Bot',
                senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
                text: `🎉 Squad Update: ${applicant.name} has officially joined the team as our ${req.targetRole}! Welcome aboard!`,
                timestamp: 'Just now'
            });
        }
    }

    req.status = 'accepted';
    state.save();
    sfx.play('success');
    updateBadges();
    renderAllViews();
    showToast(`Accepted ${req.senderName}! ${req.targetRole} role is now filled on ${project ? project.title : 'the squad'}.`);
};

// Decline Request
window.declineRequest = function(requestId) {
    const req = state.requests.find(r => r.id === requestId);
    if (!req) return;
    req.status = 'declined';
    state.save();
    updateBadges();
    renderRequests();
    showToast('Request declined.');
};

// ==========================================
// 6. TEAM CHAT & DIRECT MESSAGES VIEW
// ==========================================
function renderChat() {
    const projectList = document.getElementById('project-chats-list');
    const dmList = document.getElementById('dm-chats-list');
    const header = document.getElementById('chat-header');
    const messagesEl = document.getElementById('chat-messages');

    if (!projectList || !dmList || !header || !messagesEl) return;

    // Render Project Chats list
    projectList.innerHTML = '';
    const teamChats = state.chats.filter(c => c.type === 'team');
    teamChats.forEach(chat => {
        const item = document.createElement('div');
        item.className = `chat-channel-item ${chat.id === state.activeChatId ? 'active' : ''}`;
        item.innerHTML = `
            <span>#</span>
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(chat.title)}</span>
        `;
        item.addEventListener('click', () => {
            state.activeChatId = chat.id;
            sfx.play('click');
            renderChat();
        });
        projectList.appendChild(item);
    });

    // Render DM Chats list
    dmList.innerHTML = '';
    const dmChats = state.chats.filter(c => c.type === 'dm');
    dmChats.forEach(chat => {
        const item = document.createElement('div');
        item.className = `chat-channel-item ${chat.id === state.activeChatId ? 'active' : ''}`;
        item.innerHTML = `
            <img class="chat-channel-avatar" src="${chat.avatar}" alt="${escapeHtml(chat.title)}">
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(chat.title)}</span>
        `;
        item.addEventListener('click', () => {
            state.activeChatId = chat.id;
            sfx.play('click');
            renderChat();
        });
        dmList.appendChild(item);
    });

    // Active Chat Header & Messages
    const activeChat = state.chats.find(c => c.id === state.activeChatId) || state.chats[0];
    if (!activeChat) return;

    header.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
            ${activeChat.type === 'team' ? `
                <div class="brand-icon" style="width:34px; height:34px; font-size:14px;">⚡</div>
            ` : `
                <img src="${activeChat.avatar}" style="width:34px; height:34px; border-radius:50%; object-fit:cover;" alt="${escapeHtml(activeChat.title)}">
            `}
            <div>
                <div class="chat-active-title">${escapeHtml(activeChat.title)}</div>
                <div style="font-size:11.5px; color:var(--text-dim);">${activeChat.type === 'team' ? 'Hackathon Squad Channel' : 'Direct Conversation'}</div>
            </div>
        </div>
    `;

    // Messages
    messagesEl.innerHTML = '';
    const currentUser = state.getCurrentUser();

    (activeChat.messages || []).forEach(msg => {
        const isSelf = msg.senderId === currentUser.id;
        const msgEl = document.createElement('div');
        msgEl.className = `chat-msg ${isSelf ? 'self' : ''}`;
        msgEl.innerHTML = `
            <img class="chat-msg-avatar" src="${msg.senderAvatar}" alt="${escapeHtml(msg.senderName)}">
            <div class="chat-msg-content">
                <div class="chat-msg-author">
                    <span>${escapeHtml(msg.senderName)}</span>
                    <span class="chat-msg-time">${escapeHtml(msg.timestamp)}</span>
                </div>
                <div class="chat-msg-body">${escapeHtml(msg.text)}</div>
            </div>
        `;
        messagesEl.appendChild(msgEl);
    });

    // Scroll to bottom
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function handleSendMessage(e) {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    if (!input) return;

    const rawText = input.value.trim();
    if (!rawText) return;

    const activeChat = state.chats.find(c => c.id === state.activeChatId);
    if (!activeChat) return;

    const currentUser = state.getCurrentUser();

    // Check for Slash Commands
    if (rawText.startsWith('/task ')) {
        const taskTitle = rawText.replace('/task ', '').trim();
        const project = state.getProjectById(activeChat.targetId) || state.projects[0];
        if (project) {
            if (!project.tasks) project.tasks = [];
            project.tasks.push({
                id: `t-${Date.now()}`,
                title: taskTitle,
                status: 'backlog',
                priority: 'high',
                role: 'General',
                assignee: currentUser.name
            });
            state.save();
            renderProjects();
            sfx.play('task');
            showToast(`Task created: "${taskTitle}"`);
        }
    } else if (rawText === '/standup') {
        const standupMsg = `📋 **Daily Hackathon Standup**\n• Yesterday: Refactored architecture & tested endpoints\n• Today: Building UI integration & Kanban sprint tasks\n• Blockers: None currently. Ready for sprint push!`;
        activeChat.messages.push({
            id: `m-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            text: standupMsg,
            timestamp: 'Just now'
        });
        input.value = '';
        state.save();
        sfx.play('pop');
        renderChat();
        return;
    } else if (rawText === '/beacon') {
        const beaconMsg = `🚨 SQUAD BEACON: Actively recruiting missing roles for demo day! Check our Squad Hub for open positions.`;
        activeChat.messages.push({
            id: `m-${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            text: beaconMsg,
            timestamp: 'Just now'
        });
        input.value = '';
        state.save();
        sfx.play('pop');
        renderChat();
        return;
    }

    const newMsg = {
        id: `m-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        text: rawText,
        timestamp: 'Just now'
    };

    activeChat.messages.push(newMsg);
    input.value = '';
    state.save();
    sfx.play('pop');
    renderChat();

    // Show typing indicator
    const typingBar = document.getElementById('chat-typing-bar');
    const typingUser = document.getElementById('typing-username');
    if (typingBar) {
        typingBar.style.display = 'flex';
        let responder = "Teammate";
        if (activeChat.type === 'dm') {
            const student = state.getStudentById(activeChat.targetId);
            if (student) responder = student.name;
        } else {
            const project = state.getProjectById(activeChat.targetId);
            if (project && project.members.length > 1) {
                const other = project.members.find(m => m.userId !== state.currentUserId) || project.members[0];
                responder = other.name;
            }
        }
        if (typingUser) typingUser.textContent = `${responder} is typing...`;
    }

    setTimeout(() => {
        if (typingBar) typingBar.style.display = 'none';
        simulateChatReply(activeChat, rawText);
    }, 1100);
}

function simulateChatReply(chat, userMessage) {
    const replies = [
        "Sounds like a great plan! I'm pushing the updates to GitHub now.",
        "Awesome! I'll test the API endpoints and check the response format.",
        "Love this direction. I'll mock up the user flows in Figma so we have wireframes ready for demo day.",
        "Got it! Let's synchronize before the hackathon submission deadline to finalize our pitch slides.",
        "Perfect! That directly addresses what the hackathon judges will look for in the grading rubric."
    ];
    const replyText = replies[Math.floor(Math.random() * replies.length)];

    let responderName = "Teammate";
    let responderAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";

    if (chat.type === 'dm') {
        const student = state.getStudentById(chat.targetId);
        if (student) {
            responderName = student.name;
            responderAvatar = student.avatar;
        }
    } else {
        const project = state.getProjectById(chat.targetId);
        if (project && project.members.length > 1) {
            const other = project.members.find(m => m.userId !== state.currentUserId) || project.members[0];
            responderName = other.name;
            responderAvatar = other.avatar;
        }
    }

    chat.messages.push({
        id: `m-reply-${Date.now()}`,
        senderId: 'teammate-auto',
        senderName: responderName,
        senderAvatar: responderAvatar,
        text: replyText,
        timestamp: 'Just now'
    });

    state.save();
    sfx.play('pop');
    if (state.activeChatId === chat.id && state.activeView === 'chat') {
        renderChat();
    }
}

// Start Direct Message from Profile or Squad Member
window.startDirectMessage = function(studentId) {
    const modal = document.getElementById('project-detail-modal');
    if (modal) modal.style.display = 'none';

    const candidateModal = document.getElementById('candidate-modal');
    if (candidateModal) candidateModal.style.display = 'none';

    const student = state.getStudentById(studentId);
    if (!student) return;

    let dmChat = state.chats.find(c => c.type === 'dm' && c.targetId === studentId);
    if (!dmChat) {
        dmChat = {
            id: `chat-dm-${student.id}`,
            type: 'dm',
            targetId: student.id,
            title: `${student.name} (${student.primaryRole.split(' ')[0]})`,
            avatar: student.avatar,
            messages: [
                {
                    id: `dm-init-${Date.now()}`,
                    senderId: student.id,
                    senderName: student.name,
                    senderAvatar: student.avatar,
                    text: `Hey there! Excited to connect for the upcoming hackathon season!`,
                    timestamp: 'Just now'
                }
            ]
        };
        state.chats.push(dmChat);
        state.save();
    }

    state.activeChatId = dmChat.id;
    switchView('chat');
};

// ==========================================
// 7. APPLY MODAL & CREATE PROJECT HANDLERS
// ==========================================
window.openApplyModal = function(projectId, preferredRole = null) {
    currentSelectedProjectId = projectId;
    const project = state.getProjectById(projectId);
    if (!project) return;

    const modal = document.getElementById('apply-modal');
    const title = document.getElementById('apply-modal-title');
    const desc = document.getElementById('apply-modal-desc');
    const roleSelect = document.getElementById('apply-role-select');
    const note = document.getElementById('apply-note');

    if (title) title.textContent = `Apply to ${project.title}`;
    if (desc) desc.textContent = `Target Event: ${project.hackathon} • Track: ${project.track}`;

    const filledRoles = project.members.map(m => m.assignedRole);
    const missingRoles = project.requiredSquadRoles.filter(r => !filledRoles.includes(r));
    const rolesToShow = missingRoles.length > 0 ? missingRoles : project.requiredSquadRoles;

    if (roleSelect) {
        roleSelect.innerHTML = '';
        rolesToShow.forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            if (preferredRole && role === preferredRole) option.selected = true;
            roleSelect.appendChild(option);
        });
    }

    const currentUser = state.getCurrentUser();
    if (note) {
        note.value = `Hey team! I'm ${currentUser.name} studying ${currentUser.major} at ${currentUser.university}. I'd love to join as your ${preferredRole || rolesToShow[0]}! I have experience in ${(currentUser.skills || []).slice(0, 3).join(', ')} and ${currentUser.availability} availability.`;
    }

    if (modal) modal.style.display = 'flex';
    sfx.play('click');
};

window.openInviteModal = function(studentId) {
    currentTargetStudentId = studentId;
    const student = state.getStudentById(studentId);
    if (!student) return;

    const currentUser = state.getCurrentUser();
    const myProjects = state.projects.filter(p => p.creatorId === currentUser.id);
    const targetProject = myProjects[0] || state.projects[0];

    window.inviteCandidate(targetProject.id, student.id, student.primaryRole);
};

function handleApplySubmit(e) {
    e.preventDefault();
    const project = state.getProjectById(currentSelectedProjectId);
    if (!project) return;

    const roleSelect = document.getElementById('apply-role-select');
    const noteEl = document.getElementById('apply-note');
    const modal = document.getElementById('apply-modal');

    const currentUser = state.getCurrentUser();
    const selectedRole = roleSelect ? roleSelect.value : 'Member';
    const noteText = noteEl ? noteEl.value.trim() : '';

    const newReq = {
        id: `req-${Date.now()}`,
        projectId: project.id,
        projectTitle: project.title,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.primaryRole,
        targetRole: selectedRole,
        recipientId: project.creatorId,
        type: 'application',
        status: 'pending',
        note: noteText,
        matchScore: calculateMatchScore(currentUser, project),
        timestamp: 'Just now'
    };

    state.requests.unshift(newReq);
    state.save();
    if (modal) modal.style.display = 'none';
    sfx.play('success');
    showToast(`Application submitted for ${project.title}!`);
    updateBadges();
    renderRequests();
}

function handleCreateProject(e) {
    e.preventDefault();
    const title = document.getElementById('new-project-title').value.trim();
    const tagline = document.getElementById('new-project-tagline').value.trim();
    const hackathon = document.getElementById('new-project-hackathon').value;
    const track = document.getElementById('new-project-track').value.trim();
    const commitment = document.getElementById('new-project-commitment').value.trim();
    const deadline = document.getElementById('new-project-deadline').value.trim();
    const description = document.getElementById('new-project-description').value.trim();
    const skillsStr = document.getElementById('new-project-skills').value.trim();

    const checkedRoles = Array.from(document.querySelectorAll('#new-project-roles input[type="checkbox"]:checked')).map(cb => cb.value);
    const requiredRoles = checkedRoles.length > 0 ? checkedRoles : ['Frontend Developer', 'UI/UX Designer', 'Pitch / Presenter'];

    const currentUser = state.getCurrentUser();
    const skillsList = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : ['React', 'Python', 'Figma'];

    const newProject = {
        id: `proj-${Date.now()}`,
        title: title,
        tagline: tagline,
        description: description,
        hackathon: hackathon,
        track: track,
        timeCommitment: commitment,
        deadline: deadline,
        status: 'Recruiting Missing Roles',
        creatorId: currentUser.id,
        requiredSquadRoles: requiredRoles,
        requiredSkills: skillsList,
        members: [
            {
                userId: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                assignedRole: currentUser.primaryRole,
                isLeader: true
            }
        ],
        tasks: [
            { id: `t-${Date.now()}-1`, title: 'Define hackathon MVP scope and architecture', status: 'done', priority: 'urgent', role: 'General', assignee: currentUser.name },
            { id: `t-${Date.now()}-2`, title: 'Recruit missing squad roles and conduct kickoff sync', status: 'in_progress', priority: 'high', role: 'General', assignee: currentUser.name },
            { id: `t-${Date.now()}-3`, title: 'Build high-fidelity prototype and demo video', status: 'backlog', priority: 'medium', role: 'General', assignee: 'Unassigned' }
        ],
        devpostDraft: {
            inspiration: `${tagline}. Built specifically for ${hackathon}.`,
            whatItDoes: description,
            howWeBuiltIt: `Built using ${skillsList.join(', ')}.`,
            challenges: "Scoping an ambitious MVP for a 36-hour collegiate hackathon sprint.",
            accomplishments: "Successfully assembled a complementary 5-person squad on HackerThorne."
        }
    };

    const newChat = {
        id: `chat-${newProject.id}`,
        type: 'team',
        targetId: newProject.id,
        title: `${title} Hub`,
        avatar: currentUser.avatar,
        channel: '#general',
        messages: [
            {
                id: `m-init-${Date.now()}`,
                senderId: currentUser.id,
                senderName: currentUser.name,
                senderAvatar: currentUser.avatar,
                text: `Welcome to ${title}! Project is live on HackerThorne. Let's assemble our squad and build something awesome!`,
                timestamp: 'Just now'
            }
        ]
    };

    state.projects.unshift(newProject);
    state.chats.unshift(newChat);
    state.save();

    const createModal = document.getElementById('create-project-modal');
    if (createModal) createModal.style.display = 'none';

    const createForm = document.getElementById('create-project-form');
    if (createForm) createForm.reset();

    sfx.play('success');
    showToast(`Project "${title}" published successfully!`);
    renderProjects();
    switchView('projects');
}

// Start App on DOM Ready
document.addEventListener('DOMContentLoaded', init);
