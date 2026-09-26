/**
 * Lourdes Matha College Smart Canteen — Main Application Controller
 * Handles full state management, role authentication, cart checkout,
 * live countdown timers, QR code generation, Chart.js analytics, and real-time order sync.
 */

class SmartCanteenApp {
  constructor() {
    this.currentUser = null;
    this.cart = {}; // { foodId: qty }
    this.orders = [...CANTEEN_DATA.initialOrders];
    this.notifications = [...CANTEEN_DATA.notifications];
    this.currentRole = 'student';
    this.selectedPaymentMode = 'cash';
    this.isUpiPaid = false;

    // Audio Feedback Engine (Web Audio API)
    this.audioEnabled = localStorage.getItem('lmc_audio') !== 'false';
    this.audioCtx = null;

    // Menu Filtering & Search State
    this.publicCategory = 'all';
    this.publicSearch = '';
    this.publicDiet = 'all';
    this.publicStock = 'all'; // 'all', 'instock', 'outofstock'
    this.publicSort = 'default';

    this.studentCategory = 'all';
    this.studentSearch = '';
    this.studentDiet = 'all';
    this.studentStock = 'all'; // 'all', 'instock', 'outofstock'
    this.studentSort = 'default';

    this.adminMenuStock = 'all'; // 'all', 'instock', 'outofstock'

    // Cart & Checkout State
    this.appliedCoupon = null;
    this.pickupSlot = 'recess';

    // Modal & KOD State
    this.modalSelectedItem = null;
    this.modalQty = 1;
    this.activePassToken = null;
    this.isKodMode = false;

    // Kitchen & Admin Filtering & Search State
    this.kitchenQueueFilter = 'all';
    this.kitchenQueueSearch = '';
    this.adminOrdersFilter = 'all';
    this.adminOrdersSearch = '';

    // Dynamic Departure & Preparation Timers
    this.departureSeconds = this.calculateDepartureSeconds("11:04 AM");
    this.prepSeconds = 300;
    this.departureTimerInterval = null;
    this.prepTimerInterval = null;

    // Charts references
    this.charts = {};

    this.init();
  }

  init() {
    this.updateAudioButtons();
    this.setupEventListeners();
    this.renderPublicMenu();
    this.renderDemoChips('student');
    this.startLiveClocks();
    this.startDepartureCountdown();
    this.startPrepCountdown();
  }

  /* -------------------------------------------------------------
     UTILITIES: DYNAMIC TIMERS & ORDER RESOLUTION
     ------------------------------------------------------------- */
  calculateDepartureSeconds(departureTimeStr) {
    if (!departureTimeStr) return 180;
    const parts = departureTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!parts) return 180;

    let targetHour = parseInt(parts[1], 10);
    const targetMin = parseInt(parts[2], 10);
    const isPM = parts[3].toUpperCase() === 'PM';
    if (isPM && targetHour < 12) targetHour += 12;
    if (!isPM && targetHour === 12) targetHour = 0;

    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMin, 0);
    let diffSecs = Math.floor((targetDate.getTime() - now.getTime()) / 1000);

    // If outside active break hour or past, synchronize with realistic live 5-min stagger cycle
    if (diffSecs <= 0 || diffSecs > 3600) {
      const cycleOffset = (now.getMinutes() * 60 + now.getSeconds()) % 300;
      diffSecs = 300 - cycleOffset;
    }
    return Math.max(10, diffSecs);
  }

  getActiveOrder() {
    if (!this.currentUser) return this.orders[0] || null;
    const userActive = this.orders.find(o => 
      o.studentId === this.currentUser.id && 
      (o.status === 'Preparing' || o.status === 'Ready')
    );
    if (userActive) return userActive;
    const mostRecent = this.orders.find(o => o.studentId === this.currentUser.id);
    return mostRecent || this.orders[0] || null;
  }

  syncAllPortals() {
    this.renderStudentOrdersHistory();
    const active = this.getActiveOrder();
    if (active) this.updateActiveOrderDisplay(active);
    this.renderStaffMetrics();
    this.renderStaffLiveStream();
    this.renderStaffQueueGrid();
    this.renderStaffDemandTable();
    this.renderAdminMetrics();
    this.renderAdminOrdersMasterTable();
    this.renderAdminDemandAnalytics();
    this.renderAdminMenuTable();
    this.refreshCrowdSimulation();

    // Re-render charts
    if (this.charts.studentCrowd) this.renderStudentCrowdChart();
    if (this.charts.staffDemand) this.renderStaffDemandChart();
    if (this.charts.staffCrowd) this.renderStaffCrowdChart();
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    localStorage.setItem('lmc_audio', this.audioEnabled ? 'true' : 'false');
    this.updateAudioButtons();
    if (this.audioEnabled) {
      this.playAudioChime('bell');
      this.showToast('Audio chime enabled', '🔔');
    } else {
      this.showToast('Audio chime muted', '🔕');
    }
  }

  updateAudioButtons() {
    const icon = this.audioEnabled ? '🔔' : '🔕';
    document.querySelectorAll('.audio-toggle-btn').forEach(btn => {
      btn.textContent = icon;
      btn.title = this.audioEnabled ? 'Mute Sounds' : 'Enable Chime Sounds';
    });
  }

  playAudioChime(type = 'bell') {
    if (!this.audioEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      if (type === 'bell') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'coin') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'success') {
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.1, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.35);
        });
      } else if (type === 'beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      console.warn("Audio chime synthesis failed:", e);
    }
  }

  triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const colors = ['#720026', '#e65100', '#16a34a', '#f59e0b', '#0284c7', '#ec4899', '#8b5cf6'];
    const particles = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.4 + (Math.random() - 0.5) * 100,
        w: Math.random() * 9 + 5,
        h: Math.random() * 5 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 12 - 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    let animationFrame;
    const startTime = Date.now();
    const duration = 2500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        cancelAnimationFrame(animationFrame);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - elapsed / duration);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
  }

  /* -------------------------------------------------------------
     1. NAVIGATION & PAGE ROUTING
     ------------------------------------------------------------- */
  hideAllPages() {
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.portal-layout').forEach(p => p.classList.add('hidden'));
  }

  showLanding() {
    this.hideAllPages();
    document.getElementById('page-landing').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showPublicMenu() {
    this.hideAllPages();
    document.getElementById('page-public-menu').classList.add('active');
    this.renderPublicMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showLogin() {
    this.hideAllPages();
    document.getElementById('page-login').classList.add('active');
    this.selectRole(this.currentRole || 'student');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  quickDemoStudent() {
    const student = CANTEEN_DATA.users.find(u => u.role === 'student');
    this.loginSuccess(student);
  }

  /* -------------------------------------------------------------
     2. AUTHENTICATION & ROLE SELECTION (Section 2)
     ------------------------------------------------------------- */
  selectRole(role) {
    this.currentRole = role;
    document.querySelectorAll('.role-segment').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`role-btn-${role}`);
    if (btn) btn.classList.add('active');

    const idLabel = document.getElementById('login-id-label');
    const idInput = document.getElementById('login-id');
    const pwdInput = document.getElementById('login-password');

    if (role === 'student') {
      idLabel.textContent = 'Student ID Number';
      idInput.placeholder = 'e.g. LM2026CS101';
    } else if (role === 'staff') {
      idLabel.textContent = 'Canteen Staff ID';
      idInput.placeholder = 'e.g. LMC-STAFF-04';
    } else {
      idLabel.textContent = 'Administrator ID';
      idInput.placeholder = 'e.g. LMC-ADMIN-01';
    }

    idInput.value = '';
    pwdInput.value = '';
    this.renderDemoChips(role);
  }

  renderDemoChips(role) {
    const container = document.getElementById('demo-chips-container');
    if (!container) return;
    const users = CANTEEN_DATA.users.filter(u => u.role === role);

    container.innerHTML = users.map(u => `
      <button type="button" class="demo-chip-btn" onclick="app.fillCredentials('${u.id}', '${u.password}')">
        <span><strong class="chip-role">${u.name}</strong> (${u.department})</span>
        <span>ID: <code>${u.id}</code> / Pass: <code>${u.password}</code></span>
      </button>
    `).join('');
  }

  fillCredentials(id, pass) {
    document.getElementById('login-id').value = id;
    document.getElementById('login-password').value = pass;
    document.getElementById('login-error-msg').classList.add('hidden');
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('login-id').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    const errBox = document.getElementById('login-error-msg');

    const matchedUser = CANTEEN_DATA.users.find(u => u.id.toLowerCase() === id.toLowerCase() && u.password === pass);

    if (matchedUser) {
      errBox.classList.add('hidden');
      this.loginSuccess(matchedUser);
    } else {
      errBox.textContent = 'Invalid credentials. Please click one of the demo quick-fill buttons above.';
      errBox.classList.remove('hidden');
    }
  }

  loginSuccess(user) {
    this.currentUser = user;
    this.hideAllPages();

    if (user.role === 'student') {
      const portal = document.getElementById('portal-student');
      portal.classList.remove('hidden');
      this.initStudentPortal();
      this.showStudentView('dashboard');
      this.showToast(`Welcome back, ${user.name}! Departure assigned at ${user.assignedDeparture}`, '🎓');
    } else if (user.role === 'staff') {
      const portal = document.getElementById('portal-staff');
      portal.classList.remove('hidden');
      this.initStaffPortal();
      this.showStaffView('dashboard');
      this.showToast(`Staff console active. Kitchen queue synced.`, '👨‍🍳');
    } else if (user.role === 'admin') {
      const portal = document.getElementById('portal-admin');
      portal.classList.remove('hidden');
      this.initAdminPortal();
      this.showAdminView('dashboard');
      this.showToast(`Executive dashboard loaded with campus analytics.`, '🛡️');
    }
  }

  logout() {
    this.currentUser = null;
    this.cart = {};
    this.hideAllPages();
    this.showLanding();
    this.showToast('You have safely signed out of the Smart Canteen system.', '🚪');
  }

  showForgotPassword() {
    this.showToast("Demo Quick-Fill: Student: LM2026CS101 (pass) | Staff: LMC-STAFF-04 (staff) | Admin: LMC-ADMIN-01 (admin)", '🔑');
  }

  toggleSidebar(portalType) {
    const sidebar = document.getElementById(`${portalType}-sidebar`);
    if (sidebar) sidebar.classList.toggle('open');
  }

  /* -------------------------------------------------------------
     3. STUDENT PORTAL LOGIC & VIEWS
     ------------------------------------------------------------- */
  initStudentPortal() {
    if (!this.currentUser) return;
    const u = this.currentUser;

    // Header & sidebar details
    document.getElementById('student-header-name').textContent = u.name;
    document.getElementById('student-header-dept').textContent = `${u.department} • ${u.year}`;
    document.getElementById('student-side-name').textContent = u.name;
    document.getElementById('student-side-dept').textContent = u.departmentFull;
    document.getElementById('student-greeting-title').textContent = `Good Morning, ${u.name} 👋`;

    // Stagger Schedule details (Section 4 & 5)
    document.getElementById('disp-departure-time').textContent = u.assignedDeparture;
    document.getElementById('disp-arrival-time').textContent = u.assignedArrival;
    document.getElementById('countdown-instruction').textContent = `Classroom departure scheduled at ${u.assignedDeparture}. Walking time: 5 minutes.`;

    // Profile Tab details (Section 3)
    document.getElementById('prof-disp-name').textContent = u.name;
    document.getElementById('prof-disp-id').textContent = u.id;
    document.getElementById('prof-disp-dept-badge').textContent = u.department;
    document.getElementById('prof-disp-year').textContent = u.year;
    document.getElementById('prof-disp-class').textContent = u.class;

    document.getElementById('prof-val-name').textContent = u.name;
    document.getElementById('prof-val-id').textContent = u.id;
    document.getElementById('prof-val-dept').textContent = u.departmentFull;
    document.getElementById('prof-val-year').textContent = u.year;
    document.getElementById('prof-val-departure').textContent = u.assignedDeparture;
    document.getElementById('prof-val-arrival').textContent = u.assignedArrival;

    // Recalculate dynamic departure seconds for current department
    this.departureSeconds = this.calculateDepartureSeconds(u.assignedDeparture);
    this.startDepartureCountdown();

    this.renderDeptSwitchButtons();
    this.renderStudentFoodGrid('all');
    this.renderStudentNotifications();
    this.renderStudentOrdersHistory();
    this.updateActiveOrderDisplay();
    this.renderDeptScheduleTable();
    this.renderStudentCrowdChart();
  }

  showStudentView(viewId) {
    document.querySelectorAll('.student-view-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#student-sidebar .sidebar-nav-item').forEach(b => b.classList.remove('active'));

    const pane = document.getElementById(`sview-${viewId}`);
    if (pane) pane.classList.add('active');

    const navBtn = document.getElementById(`snav-${viewId}`);
    if (navBtn) navBtn.classList.add('active');

    // Close mobile drawer if open
    const sidebar = document.getElementById('student-sidebar');
    if (sidebar) sidebar.classList.remove('open');

    if (viewId === 'cart') this.renderCart();
    if (viewId === 'canteen-status') this.renderStudentCrowdChart();
    if (viewId === 'orders') this.renderStudentOrdersHistory();
    if (viewId === 'notifications') {
      this.notifications.forEach(n => n.read = true);
      this.updateNotifBadges();
    }
    if (viewId === 'profile') this.renderProfileBarcode();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* Department Switcher on Profile (Section 6) */
  renderDeptSwitchButtons() {
    const container = document.getElementById('dept-switch-buttons');
    if (!container) return;

    container.innerHTML = CANTEEN_DATA.departments.map(d => `
      <button class="btn btn-xs ${this.currentUser && this.currentUser.department === d.code ? 'btn-primary' : 'btn-outline'}" 
              onclick="app.switchDepartment('${d.code}')"
              title="Click to test ${d.name} schedule (${d.departureWindow})">
        ${d.code} (${d.departureWindow})
      </button>
    `).join('');
  }

  switchDepartment(deptCode) {
    const dept = CANTEEN_DATA.departments.find(d => d.code === deptCode);
    if (!dept) return;

    if (this.currentUser) {
      this.currentUser.department = dept.code;
      this.currentUser.departmentFull = dept.name;
      this.currentUser.assignedDeparture = dept.departureWindow;
      this.currentUser.assignedArrival = dept.expectedArrival;
      this.currentUser.group = dept.group;
    }

    this.departureSeconds = this.calculateDepartureSeconds(dept.departureWindow);
    this.initStudentPortal();
    this.playAudioChime('bell');
    this.showToast(`Switched active schedule to ${dept.name} (Departure: ${dept.departureWindow}, Walk: 5 mins)`, '⏰');
  }

  /* -------------------------------------------------------------
     4. COUNTDOWN TIMERS (Sections 5 & 11)
     ------------------------------------------------------------- */
  startDepartureCountdown() {
    if (this.departureTimerInterval) clearInterval(this.departureTimerInterval);

    const updateDepartureUi = () => {
      const timerElem = document.getElementById('live-departure-countdown');
      const statusElem = document.getElementById('countdown-status-text');
      const banner = document.getElementById('countdown-strip-container');

      if (this.departureSeconds > 0) {
        this.departureSeconds--;
        const mins = String(Math.floor(this.departureSeconds / 60)).padStart(2, '0');
        const secs = String(this.departureSeconds % 60).padStart(2, '0');
        if (timerElem) timerElem.textContent = `${mins}:${secs}`;
        if (statusElem) statusElem.textContent = `Assigned break departure: ${this.currentUser?.assignedDeparture || '11:04 AM'}`;
        if (banner) banner.classList.remove('pulse-urgent');
      } else {
        if (timerElem) timerElem.textContent = "00:00";
        if (statusElem) statusElem.textContent = "🔔 It's time to depart classroom for Counter 1!";
        if (banner) banner.classList.add('pulse-urgent');
      }
    };

    updateDepartureUi();
    this.departureTimerInterval = setInterval(updateDepartureUi, 1000);
  }

  startPrepCountdown() {
    if (this.prepTimerInterval) clearInterval(this.prepTimerInterval);

    const updatePrepUi = () => {
      const prepElem = document.getElementById('prep-countdown-timer');
      const activeOrder = this.getActiveOrder();

      if (!activeOrder || activeOrder.status === 'Collected') {
        if (prepElem) prepElem.textContent = "00:00";
        return;
      }

      if (activeOrder.status === 'Ready') {
        if (prepElem) prepElem.textContent = "00:00 - READY!";
        return;
      }

      if (this.prepSeconds > 0) {
        this.prepSeconds--;
        const mins = String(Math.floor(this.prepSeconds / 60)).padStart(2, '0');
        const secs = String(this.prepSeconds % 60).padStart(2, '0');
        if (prepElem) prepElem.textContent = `${mins}:${secs}`;
      } else {
        if (prepElem) prepElem.textContent = "00:00 - READY!";
        this.triggerOrderReadyState(activeOrder.token);
      }
    };

    updatePrepUi();
    this.prepTimerInterval = setInterval(updatePrepUi, 1000);
  }

  triggerOrderReadyState(token = null) {
    const activeOrder = token ? this.orders.find(o => o.token === token) : this.getActiveOrder();
    if (activeOrder && activeOrder.status !== "Collected") {
      activeOrder.status = "Ready";
    }

    const readyBanner = document.getElementById('ready-pickup-banner');
    if (readyBanner) readyBanner.classList.remove('hidden');

    const stepNode3 = document.getElementById('step-node-3');
    if (stepNode3) {
      stepNode3.classList.add('active');
      stepNode3.classList.add('completed');
    }
    const stepConn2 = document.getElementById('step-conn-2');
    if (stepConn2) stepConn2.classList.add('active');

    const statusBadge = document.getElementById('track-current-status-badge');
    if (statusBadge) {
      statusBadge.textContent = "🔔 Ready for Pickup";
      statusBadge.style.background = "#dcfce7";
      statusBadge.style.color = "#166534";
    }

    this.playAudioChime('bell');
    this.syncAllPortals();
  }

  /* -------------------------------------------------------------
     5. FOOD MENU & CART RESERVATION (Sections 7, 8, 9, 10)
     ------------------------------------------------------------- */
  /* Universal Filter Engine for Menu Views */
  filterItems(items, category, query, diet, sort, stock = 'all', macroFilter = 'all') {
    let result = [...items];

    // Category filter
    if (category && category !== 'all') {
      result = result.filter(i => i.category === category);
    }

    // Search query
    if (query && query.trim() !== '') {
      const q = query.trim().toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        (i.tags && i.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Dietary filter
    if (diet === 'veg') {
      result = result.filter(i => i.isVeg);
    } else if (diet === 'nonveg') {
      result = result.filter(i => !i.isVeg);
    } else if (diet === 'popular') {
      result = result.filter(i => i.isPopular || (i.tags && i.tags.includes("Chef's Special")));
    } else if (diet === 'quick' || diet === 'fast') {
      result = result.filter(i => {
        const prep = parseInt(i.prepTime || '5', 10);
        return prep <= 3;
      });
    } else if (diet === 'instock') {
      result = result.filter(i => i.inStock && (typeof i.dailyStock !== 'number' || i.dailyStock > 0));
    } else if (diet === 'outofstock') {
      result = result.filter(i => !i.inStock || (typeof i.dailyStock === 'number' && i.dailyStock <= 0));
    }

    // Stock availability filter
    if (stock === 'instock' || stock === 'in') {
      result = result.filter(i => i.inStock && (typeof i.dailyStock !== 'number' || i.dailyStock > 0));
    } else if (stock === 'outofstock' || stock === 'out') {
      result = result.filter(i => !i.inStock || (typeof i.dailyStock === 'number' && i.dailyStock <= 0));
    }

    // Macro filter
    if (macroFilter && macroFilter !== 'all') {
      result = result.filter(i => {
        const m = i.macros || { protein: 12, carbs: 35, fats: 8 };
        const cal = i.calories || 240;
        if (macroFilter === 'high-protein') return m.protein >= 15;
        if (macroFilter === 'low-carb')     return m.carbs < 25;
        if (macroFilter === 'low-fat')      return m.fats < 8;
        if (macroFilter === 'low-cal')      return cal < 200;
        return true;
      });
    }

    // Sorting
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    } else if (sort === 'popular') {
      result.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    }

    return result;
  }

  /* Public Menu Handlers */
  renderPublicMenu(filter = null) {
    if (filter !== null) this.publicCategory = filter;
    const grid = document.getElementById('public-food-grid');
    if (!grid) return;

    const filtered = this.filterItems(
      CANTEEN_DATA.menu,
      this.publicCategory,
      this.publicSearch,
      this.publicDiet,
      this.publicSort,
      this.publicStock
    );

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
          <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">No dishes match your criteria</h3>
          <p style="font-size: 0.9rem;">Try adjusting your search terms, dietary preferences, or stock filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(f => this.createFoodCardHtml(f, false)).join('');
  }

  filterPublicMenu(cat, btn) {
    document.querySelectorAll('#page-public-menu .category-pills-row .pill-btn, #page-public-menu .menu-filter-pills .pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.publicCategory = cat;
    this.renderPublicMenu();
  }

  handlePublicSearch(val) {
    this.publicSearch = val;
    this.renderPublicMenu();
  }

  filterPublicDiet(diet, btn) {
    document.querySelectorAll('#page-public-menu .diet-toggle-bar .diet-chip, #page-public-menu .dietary-filter-pills .pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.publicDiet = diet;
    this.renderPublicMenu();
  }

  filterPublicDietary(diet, btn) {
    this.filterPublicDiet(diet, btn);
  }

  filterPublicStock(stock, btn) {
    document.querySelectorAll('#page-public-menu .stock-toggle-bar .stock-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.publicStock = stock;
    this.renderPublicMenu();
  }

  setPublicSort(val) {
    this.publicSort = val;
    this.renderPublicMenu();
  }

  handlePublicSort(val) {
    this.setPublicSort(val);
  }

  /* Student Portal Menu Handlers */
  renderStudentFoodGrid(filter = null) {
    if (filter !== null) this.studentCategory = filter;
    const grid = document.getElementById('student-food-grid');
    if (!grid) return;

    const filtered = this.filterItems(
      CANTEEN_DATA.menu,
      this.studentCategory,
      this.studentSearch,
      this.studentDiet,
      this.studentSort,
      this.studentStock,
      this.studentMacro || 'all'
    );

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
          <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">No menu items match</h3>
          <p style="font-size: 0.9rem;">Try adjusting your category, dietary, stock, or macro filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(f => this.createFoodCardHtml(f, true)).join('');
  }

  filterMenu(cat, btn) {
    document.querySelectorAll('#sview-menu .category-pills-row .pill-btn, #sview-menu .menu-filter-pills .pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.studentCategory = cat;
    this.renderStudentFoodGrid();
  }

  handleStudentSearch(val) {
    this.studentSearch = val;
    this.renderStudentFoodGrid();
  }

  filterStudentDiet(diet, btn) {
    document.querySelectorAll('#sview-menu .diet-toggle-bar .diet-chip, #sview-menu .dietary-filter-pills .pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.studentDiet = diet;
    this.renderStudentFoodGrid();
  }

  filterStudentDietary(diet, btn) {
    this.filterStudentDiet(diet, btn);
  }

  filterStudentStock(stock, btn) {
    document.querySelectorAll('#sview-menu .stock-toggle-bar .stock-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.studentStock = stock;
    this.renderStudentFoodGrid();
  }

  filterStudentMacro(macro, btn) {
    document.querySelectorAll('#student-macro-bar .macro-chip').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.studentMacro = macro;
    this.renderStudentFoodGrid();
  }

  setStudentSort(val) {
    this.studentSort = val;
    this.renderStudentFoodGrid();
  }

  handleStudentSort(val) {
    this.setStudentSort(val);
  }

  /* Food Card Template with Interactive Badges and Quick View */
  createFoodCardHtml(f, isInteractive) {
    const currentQty = this.cart[f.id] || 0;
    const isOutOfStock = !f.inStock || (typeof f.dailyStock === 'number' && f.dailyStock <= 0);
    const tagHtml = (f.tags && f.tags.length > 0)
      ? `<span class="food-tag-chip">${f.tags[0]}</span>`
      : (f.isPopular ? `<span class="food-tag-chip">Popular</span>` : '');

    return `
      <div class="food-card ${isOutOfStock ? 'is-sold-out' : ''}" id="food-card-${f.id}">
        <div class="food-card-img-wrapper">
          <img src="${f.image}" alt="${f.name}" class="food-card-img" loading="lazy" />
          <div class="food-diet-tag">
            <span class="${f.isVeg ? 'diet-dot-veg' : 'diet-dot-nonveg'}"></span>
            <span>${f.isVeg ? 'VEG' : 'NON-VEG'}</span>
          </div>
          ${tagHtml}
          <div class="food-avail-badge ${isOutOfStock ? 'out-of-stock' : ''}">
            ${isOutOfStock ? 'Sold Out' : (f.dailyStock <= 5 ? `Only ${f.dailyStock} Left!` : 'Available Fresh')}
          </div>
          <button class="quick-view-overlay-btn" onclick="app.openItemModal('${f.id}')" title="Quick View Details">
            👁️ Quick View
          </button>
        </div>
        <div class="food-card-body">
          <div>
            <div class="food-card-header">
              <h3 class="food-name" onclick="app.openItemModal('${f.id}')" style="cursor: pointer;">${f.name}</h3>
              <span class="food-price">₹${f.price}</span>
            </div>
            <p class="food-desc">${f.description}</p>
            <div class="food-meta-strip">
              <span class="meta-pill" title="Portion Calories">🔥 ${f.calories || 240} kcal</span>
              <span class="meta-pill" title="Kitchen Prep Speed">⏱️ ${f.prepTime || '4m'}</span>
              <span class="meta-pill meta-rating" title="Student Rating">⭐ ${f.rating || 4.7}</span>
              ${!isOutOfStock && f.dailyStock ? `<span class="meta-pill" title="Stock Remaining">📦 ${f.dailyStock} left</span>` : ''}
            </div>
          </div>

          <div class="food-card-action">
            ${isInteractive ? `
              ${isOutOfStock ? `
                <button class="btn btn-sm btn-disabled" disabled style="width: 100%; opacity: 0.6; cursor: not-allowed; background: #e2e8f0; color: #64748b; font-weight: 600; border: none; border-radius: 8px; padding: 0.5rem 1rem;">
                  Sold Out
                </button>
              ` : (currentQty > 0 ? `
                <div class="qty-stepper">
                  <button class="qty-btn" onclick="app.changeQty('${f.id}', -1)">−</button>
                  <span class="qty-count">${currentQty}</span>
                  <button class="qty-btn" onclick="app.changeQty('${f.id}', 1)" ${currentQty >= (f.dailyStock || 10) ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>+</button>
                </div>
              ` : `
                <button class="btn-add-food" onclick="app.changeQty('${f.id}', 1)">
                  + Reserve Item
                </button>
              `)}
            ` : `
              <button class="btn btn-outline btn-sm" onclick="app.showLogin()">Login to Order</button>
            `}
          </div>
        </div>
      </div>
    `;
  }

  /* Quick View Item Detail Modal */
  openItemModal(foodId) {
    const item = CANTEEN_DATA.menu.find(f => f.id === foodId);
    if (!item) return;
    this.modalSelectedItem = item;
    const isOutOfStock = !item.inStock || (typeof item.dailyStock === 'number' && item.dailyStock <= 0);
    this.modalQty = isOutOfStock ? 0 : Math.max(1, Math.min(this.cart[foodId] || 1, item.dailyStock || 10));
    this.selectedPortion = 'regular';
    
    // Reset portion UI
    document.querySelectorAll('.portion-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.style.borderColor = 'var(--border-light)';
      btn.style.color = 'var(--text-primary)';
    });
    const regBtn = document.getElementById('portion-regular');
    if (regBtn) {
      regBtn.classList.add('active');
      regBtn.style.borderColor = 'var(--primary-maroon)';
      regBtn.style.color = 'var(--primary-maroon)';
    }

    const img = document.getElementById('mid-item-img');
    if (img) img.src = item.image;

    const nameElem = document.getElementById('mid-item-name');
    if (nameElem) nameElem.textContent = item.name;

    const descElem = document.getElementById('mid-item-desc');
    if (descElem) descElem.textContent = item.description;

    const priceElem = document.getElementById('mid-item-price');
    if (priceElem) priceElem.textContent = `₹${item.price}`;

    const calElem = document.getElementById('mid-item-calories');
    if (calElem) calElem.textContent = `${item.calories || 240} kcal`;
    
    if (item.macros) {
      const pElem = document.getElementById('mid-item-protein');
      if (pElem) pElem.textContent = `${item.macros.protein}g`;
      const cElem = document.getElementById('mid-item-carbs');
      if (cElem) cElem.textContent = `${item.macros.carbs}g`;
      const fElem = document.getElementById('mid-item-fats');
      if (fElem) fElem.textContent = `${item.macros.fats}g`;
    }

    const tagsElem = document.getElementById('mid-item-tags');
    if (tagsElem) {
      tagsElem.innerHTML = '';
      if (item.tags && item.tags.length > 0) {
        item.tags.forEach(t => {
          const s = document.createElement('span');
          s.className = 'food-meta-tags span';
          s.style.background = '#f1f5f9';
          s.style.padding = '0.2rem 0.5rem';
          s.style.borderRadius = '4px';
          s.style.fontSize = '0.75rem';
          s.style.marginRight = '0.4rem';
          s.textContent = t;
          tagsElem.appendChild(s);
        });
      }
    }

    const totalElem = document.getElementById('modal-add-total') || document.getElementById('mid-add-btn');
    if (totalElem && totalElem.tagName !== 'BUTTON') totalElem.textContent = `₹${item.price * this.modalQty}`;

    const addBtn = document.querySelector('#item-detail-modal .modal-footer .btn-primary') || document.getElementById('mid-add-btn');
    if (addBtn) {
      if (isOutOfStock) {
        addBtn.disabled = true;
        addBtn.style.opacity = '0.5';
        addBtn.style.cursor = 'not-allowed';
        addBtn.textContent = 'Sold Out Today';
      } else {
        addBtn.disabled = false;
        addBtn.style.opacity = '1';
        addBtn.style.cursor = 'pointer';
        addBtn.innerHTML = `<span>+</span> Add to Reservation`;
      }
    }

    const modal = document.getElementById('item-detail-modal');
    if (modal) modal.classList.add('active');
  }
  
  setPortion(size) {
    this.selectedPortion = size;
    document.querySelectorAll('.portion-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.style.borderColor = 'var(--border-light)';
      btn.style.color = 'var(--text-primary)';
    });
    const activeBtn = document.getElementById(`portion-${size}`);
    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.style.borderColor = 'var(--primary-maroon)';
      activeBtn.style.color = 'var(--primary-maroon)';
    }
    
    if (this.modalSelectedItem) {
      const mult = size === 'large' ? 1.5 : 1.0;
      
      const priceElem = document.getElementById('mid-item-price');
      if (priceElem) priceElem.textContent = `₹${Math.floor(this.modalSelectedItem.price * mult)}`;
      
      const calElem = document.getElementById('mid-item-calories');
      if (calElem) calElem.textContent = `${Math.floor((this.modalSelectedItem.calories || 240) * mult)} kcal`;
      
      if (this.modalSelectedItem.macros) {
        const pElem = document.getElementById('mid-item-protein');
        if (pElem) pElem.textContent = `${Math.floor(this.modalSelectedItem.macros.protein * mult)}g`;
        const cElem = document.getElementById('mid-item-carbs');
        if (cElem) cElem.textContent = `${Math.floor(this.modalSelectedItem.macros.carbs * mult)}g`;
        const fElem = document.getElementById('mid-item-fats');
        if (fElem) fElem.textContent = `${Math.floor(this.modalSelectedItem.macros.fats * mult)}g`;
      }
    }
  }

  closeItemModal() {
    const modal = document.getElementById('item-detail-modal');
    if (modal) modal.classList.remove('active');
    this.modalSelectedItem = null;
  }

  updateModalQty(delta) {
    if (!this.modalSelectedItem) return;
    const item = this.modalSelectedItem;
    if (!item.inStock || item.dailyStock <= 0) return;

    const maxStock = item.dailyStock || 10;
    if (delta > 0 && this.modalQty >= maxStock) {
      this.showToast(`Maximum ${maxStock} portions available today for ${item.name}`, '⚠️');
      return;
    }

    this.modalQty = Math.max(1, Math.min(maxStock, this.modalQty + delta));
    const qtyElem = document.getElementById('modal-food-qty');
    if (qtyElem) qtyElem.textContent = this.modalQty;
  }

  addItemFromModal() {
    if (!this.modalSelectedItem) return;
    const item = this.modalSelectedItem;
    if (!item.inStock || (item.dailyStock && item.dailyStock <= 0)) {
      this.showToast(`${item.name} is currently sold out today.`, '⚠️');
      return;
    }

    const maxStock = item.dailyStock || 10;
    const finalQty = Math.min(this.modalQty, maxStock);
    
    // Add portion modifier to cart ID to track regular/large separately
    const mult = this.selectedPortion === 'large' ? 1.5 : 1.0;
    const cartId = this.selectedPortion === 'large' ? `${item.id}-L` : item.id;
    
    // We would need to update the cart rendering and price calculation to support dynamic prices, 
    // but for now let's just use the cart items natively. Since cart is just key=value for qty,
    // we would need to store price somewhere.
    // Given the current architecture, changing cart schema to handle different prices per ID might break 
    // `updateCartUi()` which uses `CANTEEN_DATA.menu.find(f => f.id === foodId)`.
    // Let's just create a new menu item on the fly for the large portion, or override.
    if (this.selectedPortion === 'large') {
      const existing = CANTEEN_DATA.menu.find(f => f.id === cartId);
      if (!existing) {
        CANTEEN_DATA.menu.push({
          ...item,
          id: cartId,
          name: `${item.name} (Large)`,
          price: Math.floor(item.price * mult),
          calories: Math.floor(item.calories * mult),
        });
      }
    }
    
    this.cart[cartId] = (this.cart[cartId] || 0) + finalQty;
    this.updateCartUi();
    this.renderStudentFoodGrid();
    this.playAudioChime('coin');
    const pName = this.selectedPortion === 'large' ? 'Large ' : '';
    this.showToast(`Added ${finalQty} × ${pName}${item.name} to cart`, '🛒');
    this.closeItemModal();
  }

  changeQty(foodId, delta) {
    const food = CANTEEN_DATA.menu.find(f => f.id === foodId);
    const current = this.cart[foodId] || 0;

    if (delta > 0) {
      if (food) {
        if (!food.inStock || (typeof food.dailyStock === 'number' && food.dailyStock <= 0)) {
          this.playAudioChime('beep');
          this.showToast(`Sorry, ${food.name} is completely sold out today!`, '⚠️');
          return;
        }
        if (typeof food.dailyStock === 'number' && current + delta > food.dailyStock) {
          this.playAudioChime('beep');
          this.showToast(`Only ${food.dailyStock} portions of ${food.name} remaining in kitchen today!`, '⚠️');
          return;
        }
      }
    }

    const newQty = Math.max(0, current + delta);

    if (newQty === 0) {
      delete this.cart[foodId];
    } else {
      this.cart[foodId] = newQty;
    }

    this.updateCartUi();
    this.renderStudentFoodGrid(document.querySelector('#sview-menu .pill-btn.active')?.dataset?.cat || 'all');
  }

  clearCart() {
    this.cart = {};
    this.updateCartUi();
    this.renderCart();
    this.renderStudentFoodGrid('all');
    this.showToast('Reservation cart cleared.', '🛒');
  }

  updateCartUi() {
    const entries = Object.entries(this.cart);
    let totalCount = 0;
    let totalCost = 0;

    entries.forEach(([id, qty]) => {
      const food = CANTEEN_DATA.menu.find(f => f.id === id);
      if (food) {
        totalCount += qty;
        totalCost += food.price * qty;
      }
    });

    // Update badges and bars
    document.querySelectorAll('.header-cart-count').forEach(e => e.textContent = totalCount);
    const sideBadge = document.getElementById('snav-cart-badge');
    if (sideBadge) sideBadge.textContent = totalCount;

    const floatBar = document.getElementById('student-floating-cart');
    if (floatBar) {
      if (totalCount > 0) {
        floatBar.classList.remove('hidden');
        document.getElementById('fc-item-count').textContent = totalCount;
        document.getElementById('fc-total-amount').textContent = `₹${totalCost}`;
      } else {
        floatBar.classList.add('hidden');
      }
    }
  }

  /* Cart & Promo Coupon System */
  applyPromoCode() {
    const input = document.getElementById('cart-promo-input');
    if (!input) return;
    const code = input.value.trim().toUpperCase();

    if (!code) {
      this.showToast('Please enter a coupon code.', '⚠️');
      return;
    }

    const coupon = CANTEEN_DATA.coupons.find(c => c.code === code);
    if (!coupon) {
      this.playAudioChime('beep');
      this.showToast(`Invalid coupon code '${code}'. Try 'LMC10' or 'FREEDOSA'`, '❌');
      return;
    }

    this.appliedCoupon = coupon;
    this.renderCart();
    this.playAudioChime('coin');
    this.showToast(`Coupon '${coupon.code}' applied! ${coupon.description}`, '🏷️');
  }

  removeCoupon() {
    this.appliedCoupon = null;
    const input = document.getElementById('cart-promo-input');
    if (input) input.value = '';
    this.renderCart();
    this.showToast('Coupon removed.', '🗑️');
  }

  selectPickupSlot(slot) {
    this.pickupSlot = slot;
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
    const target = document.getElementById(`btn-slot-${slot}`);
    if (target) target.classList.add('active');
    this.showToast(`Pickup window set to ${slot === 'recess' ? 'Morning Recess (11:00-11:15 AM)' : 'Lunch Break (1:10-1:55 PM)'}`, '⏱️');
  }

  renderCart() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const summaryLines = document.getElementById('summary-line-items');
    const subtotalElem = document.getElementById('summary-subtotal');
    const totalElem = document.getElementById('summary-total');
    const upiPayAmount = document.getElementById('upi-pay-amount');

    const entries = Object.entries(this.cart);

    if (entries.length === 0) {
      if (container) container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      if (summaryLines) summaryLines.innerHTML = '<div class="text-muted" style="font-size: 0.85rem;">No items in cart</div>';
      if (subtotalElem) subtotalElem.textContent = '₹0';
      if (totalElem) totalElem.textContent = '₹0';
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    let total = 0;
    let itemsHtml = '';
    let summaryHtml = '';

    entries.forEach(([id, qty]) => {
      const food = CANTEEN_DATA.menu.find(f => f.id === id);
      if (!food) return;
      const sub = food.price * qty;
      total += sub;

      itemsHtml += `
        <div class="cart-item-row">
          <div class="cart-item-info">
            <img src="${food.image}" alt="${food.name}" class="cart-item-thumb" />
            <div>
              <div class="cart-item-title">${food.name}</div>
              <div class="cart-item-rate">₹${food.price} each</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="app.changeQty('${food.id}', -1)">−</button>
              <span class="qty-count">${qty}</span>
              <button class="qty-btn" onclick="app.changeQty('${food.id}', 1)">+</button>
            </div>
            <div class="cart-item-subtotal">₹${sub}</div>
          </div>
        </div>
      `;

      summaryHtml += `
        <div class="summary-line-row">
          <span>${food.name} × ${qty}</span>
          <strong>₹${sub}</strong>
        </div>
      `;
    });

    // Discount calculations
    let discountAmount = 0;
    if (this.appliedCoupon) {
      if (this.appliedCoupon.type === 'percentage') {
        discountAmount = Math.round((total * this.appliedCoupon.discount) / 100);
      } else if (this.appliedCoupon.type === 'fixed') {
        discountAmount = Math.min(total, this.appliedCoupon.discount);
      }
    }
    const grandTotal = Math.max(0, total - discountAmount);

    // Update coupon display row
    const discountRow = document.getElementById('summary-discount-row');
    const discountVal = document.getElementById('summary-discount-val');
    const appliedChip = document.getElementById('cart-applied-coupon-chip');
    const chipCode = document.getElementById('applied-coupon-code');

    if (discountRow && discountVal) {
      if (this.appliedCoupon && discountAmount > 0) {
        discountRow.classList.remove('hidden');
        discountVal.textContent = `-₹${discountAmount}`;
        if (appliedChip && chipCode) {
          chipCode.textContent = `${this.appliedCoupon.code} (${this.appliedCoupon.description})`;
          appliedChip.classList.remove('hidden');
        }
      } else {
        discountRow.classList.add('hidden');
        if (appliedChip) appliedChip.classList.add('hidden');
      }
    }

    if (container) container.innerHTML = itemsHtml;
    if (summaryLines) summaryLines.innerHTML = summaryHtml;
    if (subtotalElem) subtotalElem.textContent = `₹${total}`;
    if (totalElem) totalElem.textContent = `₹${grandTotal}`;
    if (upiPayAmount) upiPayAmount.textContent = `₹${grandTotal}`;

    // Render demo UPI QR on canvas
    this.renderUpiQrCanvas(grandTotal);
  }

  selectPaymentMode(mode) {
    this.selectedPaymentMode = mode;
    document.querySelectorAll('.payment-choice-label').forEach(l => l.classList.remove('active'));

    const cashPanel = document.getElementById('cash-info-panel');
    const upiPanel = document.getElementById('upi-sim-panel');

    if (mode === 'cash') {
      document.getElementById('label-pay-cash').classList.add('active');
      if (cashPanel) cashPanel.classList.remove('hidden');
      if (upiPanel) upiPanel.classList.add('hidden');
    } else {
      document.getElementById('label-pay-upi').classList.add('active');
      if (cashPanel) cashPanel.classList.add('hidden');
      if (upiPanel) upiPanel.classList.remove('hidden');
    }
  }

  renderUpiQrCanvas(amount) {
    const canvas = document.getElementById('upi-canvas');
    if (!canvas || typeof QRCode === 'undefined') return;
    const upiString = `upi://pay?pa=lourdesmatha.canteen@sbi&pn=LMC+Canteen&am=${amount}&cu=INR`;
    QRCode.toCanvas(canvas, upiString, { width: 130, margin: 1 }, function (error) {
      if (error) console.error(error);
    });
  }

  simulateUpiPay() {
    const btn = document.getElementById('btn-simulate-upi');
    const success = document.getElementById('upi-success-indicator');
    btn.textContent = 'Verifying UPI pin...';
    btn.disabled = true;

    setTimeout(() => {
      this.isUpiPaid = true;
      btn.textContent = '✅ Payment Verified';
      btn.disabled = false;
      if (success) success.classList.remove('hidden');
      this.playAudioChime('coin');
      this.showToast('UPI Payment verified! Token generation ready.', '📱');
    }, 1200);
  }

  /* ORDER CONFIRMATION & TOKEN QR GENERATION (Section 10) */
  createOrderReservation() {
    const entries = Object.entries(this.cart);
    if (entries.length === 0) {
      this.showToast("Please add at least one dish to confirm a reservation.", "⚠️");
      this.showStudentView('menu');
      return;
    }

    // Logical Validation: Require UPI payment verification if UPI mode is selected
    if (this.selectedPaymentMode === 'upi' && !this.isUpiPaid) {
      this.playAudioChime('beep');
      this.showToast('Please simulate UPI payment approval first before confirming reservation.', '⚠️');
      const upiPanel = document.getElementById('upi-sim-panel');
      if (upiPanel) {
        upiPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Logical Validation: Check stock limits
    let hasStockError = false;
    entries.forEach(([id, qty]) => {
      const food = CANTEEN_DATA.menu.find(f => f.id === id);
      if (!food || !food.inStock || (typeof food.dailyStock === 'number' && qty > food.dailyStock)) {
        this.playAudioChime('beep');
        this.showToast(`Sorry, ${food ? food.name : 'an item'} does not have ${qty} portions available.`, '❌');
        hasStockError = true;
      }
    });
    if (hasStockError) return;

    // Decrement stock in real-time & update kitchen demand
    entries.forEach(([id, qty]) => {
      const food = CANTEEN_DATA.menu.find(f => f.id === id);
      if (food) {
        food.dailyStock = Math.max(0, (food.dailyStock || 10) - qty);
        if (food.dailyStock === 0) food.inStock = false;
        food.soldCount = (food.soldCount || 0) + qty;

        const dem = CANTEEN_DATA.foodDemand ? CANTEEN_DATA.foodDemand.find(d => d.name.toLowerCase() === food.name.toLowerCase()) : null;
        if (dem) {
          dem.sold = (dem.sold || 0) + qty;
          dem.remaining = Math.max(0, (dem.remaining || dem.totalStock) - qty);
        }
      }
    });

    const u = this.currentUser || CANTEEN_DATA.users[0];
    const token = `SC-${Math.floor(100 + Math.random() * 899)}`;
    let total = 0;
    const itemsList = [];

    entries.forEach(([id, qty]) => {
      const food = CANTEEN_DATA.menu.find(f => f.id === id);
      if (food) {
        total += food.price * qty;
        itemsList.push({ name: food.name, qty: qty, price: food.price });
      }
    });

    let discountAmount = 0;
    if (this.appliedCoupon) {
      if (this.appliedCoupon.type === 'percentage') {
        discountAmount = Math.round((total * this.appliedCoupon.discount) / 100);
      } else if (this.appliedCoupon.type === 'fixed') {
        discountAmount = Math.min(total, this.appliedCoupon.discount);
      }
    }
    const grandTotal = Math.max(0, total - discountAmount);
    const specialNotes = document.getElementById('cart-special-notes')?.value.trim() || '';

    const newOrder = {
      token: token,
      studentId: u.id,
      studentName: u.name,
      department: u.department,
      items: itemsList,
      total: grandTotal,
      originalTotal: total,
      discount: discountAmount,
      coupon: this.appliedCoupon ? this.appliedCoupon.code : null,
      notes: specialNotes,
      pickupSlot: this.pickupSlot,
      paymentMethod: this.selectedPaymentMode === 'upi' ? 'UPI / Google Pay' : 'Cash at Canteen',
      arrivalTime: u.assignedArrival || "11:09 AM",
      departureTime: u.assignedDeparture || "11:04 AM",
      status: "Preparing",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      prepRemainingSeconds: 455
    };

    // Prepend to orders list
    this.orders.unshift(newOrder);

    // Sync to backend asynchronously if available
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      }).catch(() => console.log('Backend offline - cached in local memory.'));
    } catch (e) {
      // offline fallback
    }

    // Populate Confirmation View (Section 10)
    document.getElementById('conf-token-id').textContent = token;
    document.getElementById('conf-student-name').textContent = u.name;
    document.getElementById('conf-student-id').textContent = u.id;
    document.getElementById('conf-dept').textContent = `${u.department} (${u.departmentFull || 'Computer Science'})`;
    document.getElementById('conf-items-summary').textContent = itemsList.map(i => `${i.name} × ${i.qty}`).join(', ');
    document.getElementById('conf-total-amount').textContent = `₹${grandTotal}`;
    document.getElementById('conf-departure-time').textContent = u.assignedDeparture || "11:04 AM";
    document.getElementById('conf-arrival-time').textContent = `${u.assignedArrival || "11:09 AM"} (5-min walk)`;
    document.getElementById('conf-payment-method').textContent = newOrder.paymentMethod;

    // Generate Official QR Code
    this.renderTokenQrCode(token, u.id, grandTotal);

    // Confetti celebration & audio chime
    this.triggerConfetti();
    this.playAudioChime('success');

    // Reset cart, promo coupon and UPI state
    this.cart = {};
    this.appliedCoupon = null;
    this.isUpiPaid = false;
    const upiBtn = document.getElementById('btn-simulate-upi');
    if (upiBtn) {
      upiBtn.textContent = '⚡ Simulate UPI App Approval';
      upiBtn.disabled = false;
    }
    const upiSuccess = document.getElementById('upi-success-indicator');
    if (upiSuccess) upiSuccess.classList.add('hidden');

    const notesInput = document.getElementById('cart-special-notes');
    if (notesInput) notesInput.value = '';
    const promoInput = document.getElementById('cart-promo-input');
    if (promoInput) promoInput.value = '';

    this.updateCartUi();
    this.showStudentView('confirmation');
    this.showToast(`Order confirmed! Token: ${token} issued.`, '🎫');

    // Update active order tracking & sync across portals
    this.updateActiveOrderDisplay(newOrder);
    this.prepSeconds = 455;
    this.startPrepCountdown();
    this.syncAllPortals();
  }

  /* Walking Route Modal Guidance */
  showCampusWalkRoute() {
    const deptCode = this.currentUser ? this.currentUser.department : 'CS';
    const route = CANTEEN_DATA.campusRoutes[deptCode] || CANTEEN_DATA.campusRoutes['CS'];

    const titleElem = document.getElementById('route-dept-title');
    if (titleElem) titleElem.textContent = `${route.origin} → Campus Canteen`;

    const timeElem = document.getElementById('route-total-time');
    if (timeElem) timeElem.textContent = `Estimated walking time: 5 minutes (${route.distance})`;

    const stepsContainer = document.getElementById('route-steps-container');
    if (stepsContainer) {
      stepsContainer.innerHTML = route.steps.map((step, idx) => `
        <div class="route-step-node">
          <div class="step-num-badge">${idx + 1}</div>
          <div class="step-desc-text">
            <strong>${step.split(':')[0]}</strong>
            <div>${step.split(':').slice(1).join(':') || step}</div>
          </div>
        </div>
      `).join('');
    }

    const tipsElem = document.getElementById('route-tips-container');
    if (tipsElem) {
      tipsElem.innerHTML = `
        <div class="route-tip-box">
          <span>💡</span>
          <div><strong>Stagger Advisory:</strong> Depart classroom at <strong>${this.currentUser?.assignedDeparture || '11:04 AM'}</strong> to arrive at the canteen counter precisely when your meal is prepared.</div>
        </div>
      `;
    }

    const modal = document.getElementById('campus-walk-modal');
    if (modal) modal.classList.add('active');
  }

  closeCampusWalkModal() {
    const modal = document.getElementById('campus-walk-modal');
    if (modal) modal.classList.remove('active');
  }

  /* Printable Boarding Pass Token Modal */
  openTokenPassModal(token = null) {
    const orderToken = token || (this.getActiveOrder() ? this.getActiveOrder().token : (this.orders[0] ? this.orders[0].token : 'SC-101'));
    const order = this.orders.find(o => o.token === orderToken) || this.orders[0];
    if (!order) return;

    this.activePassToken = order.token;

    const titleElem = document.getElementById('pass-token-title');
    if (titleElem) titleElem.textContent = order.token;

    const nameElem = document.getElementById('pass-student-name');
    if (nameElem) nameElem.textContent = order.studentName || this.currentUser?.name || 'Amal Krishna';

    const idElem = document.getElementById('pass-student-id');
    if (idElem) idElem.textContent = order.studentId || this.currentUser?.id || 'LM2026CS101';

    const deptElem = document.getElementById('pass-dept');
    if (deptElem) deptElem.textContent = order.department || this.currentUser?.department || 'CS';

    const depElem = document.getElementById('pass-dep-time');
    if (depElem) depElem.textContent = order.departureTime || '11:04 AM';

    const arrElem = document.getElementById('pass-arr-time');
    if (arrElem) arrElem.textContent = order.arrivalTime || '11:09 AM';

    const payElem = document.getElementById('pass-payment-mode');
    if (payElem) payElem.textContent = order.paymentMethod;

    const totalElem = document.getElementById('pass-total-cost');
    if (totalElem) totalElem.textContent = `₹${order.total}`;

    const itemsContainer = document.getElementById('pass-items-tbody');
    if (itemsContainer) {
      itemsContainer.innerHTML = order.items.map(i => `
        <tr>
          <td>${i.name}</td>
          <td>${i.qty}</td>
          <td>₹${i.price}</td>
          <td class="text-right">₹${i.price * i.qty}</td>
        </tr>
      `).join('');
    }

    // Render Barcode on pass
    const passBarcodeSvg = document.getElementById('pass-barcode-svg');
    if (passBarcodeSvg) {
      this.drawNativeBarcodeSvg(passBarcodeSvg, order.token);
    }

    // Render QR Code on pass
    const qrContainer = document.getElementById('pass-qr-canvas-wrapper');
    if (qrContainer && typeof QRCode !== 'undefined') {
      qrContainer.innerHTML = '';
      const canvas = document.createElement('canvas');
      QRCode.toCanvas(canvas, JSON.stringify({ token: order.token, student: order.studentId, amount: order.total }), { width: 110, margin: 1 });
      qrContainer.appendChild(canvas);
    }

    const modal = document.getElementById('token-pass-modal');
    if (modal) modal.classList.add('active');
  }

  closeTokenPassModal() {
    const modal = document.getElementById('token-pass-modal');
    if (modal) modal.classList.remove('active');
  }

  copyTokenToClipboard() {
    const token = this.activePassToken || (this.getActiveOrder() ? this.getActiveOrder().token : (this.orders[0] ? this.orders[0].token : ''));
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(token).then(() => {
        this.playAudioChime('beep');
        this.showToast(`Token '${token}' copied to clipboard!`, '📋');
      }).catch(() => {
        this.showToast(`Token: ${token}`, '📋');
      });
    } else {
      this.showToast(`Token: ${token}`, '📋');
    }
  }

  printTokenPass() {
    window.print();
  }

  renderTokenQrCode(token, studentId, amount) {
    const container = document.getElementById('conf-qrcode-container');
    if (!container || typeof QRCode === 'undefined') return;
    container.innerHTML = '';

    const qrPayload = JSON.stringify({
      college: "LMC-CANTEEN",
      token: token,
      studentId: studentId,
      amount: amount,
      break: "11:00-11:15"
    });

    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, qrPayload, { width: 150, margin: 1 }, function (error) {
      if (error) console.error(error);
    });
    container.appendChild(canvas);
  }

  renderProfileBarcode(token) {
    let activeToken = token;
    if (!activeToken) {
      const active = this.getActiveOrder();
      activeToken = active ? active.token : (this.currentUser?.token || (this.orders[0] ? this.orders[0].token : "SC-101"));
    }

    const svgElem = document.getElementById('profile-barcode-svg');
    const labelElem = document.getElementById('profile-barcode-token');

    if (labelElem) {
      labelElem.textContent = `Token: ${activeToken}`;
    }

    if (!svgElem) return;

    if (typeof JsBarcode === 'function') {
      try {
        JsBarcode(svgElem, activeToken, {
          format: "CODE128",
          lineColor: "#0f172a",
          width: 2,
          height: 48,
          displayValue: false,
          margin: 6,
          background: "#ffffff"
        });
        return;
      } catch (err) {
        console.warn("JsBarcode generation failed, falling back to native SVG:", err);
      }
    }

    this.drawNativeBarcodeSvg(svgElem, activeToken);
  }

  drawNativeBarcodeSvg(svgElem, text) {
    const CODE39 = {
      '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
      '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
      '8': '100100100', '9': '001100100', 'A': '100001001', 'B': '001001001',
      'C': '101001000', 'D': '000011001', 'E': '100011000', 'F': '001011000',
      'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
      'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011',
      'O': '100010010', 'P': '001010010', 'Q': '000000111', 'R': '100000110',
      'S': '001000110', 'T': '000010110', 'U': '110000001', 'V': '011000001',
      'W': '111000000', 'X': '010010001', 'Y': '110010000', 'Z': '011010000',
      '-': '010000101', '.': '110000100', ' ': '011000100', '$': '010101000',
      '/': '010100010', '+': '010001010', '%': '000101010', '*': '010010100'
    };

    const cleanText = (text || (this.getActiveOrder() ? this.getActiveOrder().token : 'SC-TOKEN')).toUpperCase().replace(/[^0-9A-Z\-\. \$\/\+\%]/g, '');
    const encoded = '*' + cleanText + '*';
    const narrow = 2;
    const wide = 5;
    const height = 48;
    let x = 12;
    let rects = '';

    for (let i = 0; i < encoded.length; i++) {
      const pattern = CODE39[encoded[i]];
      if (!pattern) continue;
      for (let j = 0; j < 9; j++) {
        const isBar = (j % 2 === 0);
        const isWide = pattern[j] === '1';
        const w = isWide ? wide : narrow;
        if (isBar) {
          rects += `<rect x="${x}" y="0" width="${w}" height="${height}" fill="#0f172a" />`;
        }
        x += w;
      }
      x += narrow;
    }

    const totalWidth = x + 12;
    svgElem.setAttribute('viewBox', `0 0 ${totalWidth} ${height}`);
    svgElem.setAttribute('width', `${totalWidth}`);
    svgElem.setAttribute('height', `${height}`);
    svgElem.innerHTML = rects;
  }

  updateActiveOrderDisplay(order) {
    const active = order || this.getActiveOrder();
    if (!active) {
      const activeCard = document.getElementById('order-tracking-active-card');
      if (activeCard) {
        const tokenDisplay = document.getElementById('track-token-display');
        if (tokenDisplay) tokenDisplay.textContent = 'No Active Orders';
        const badge = document.getElementById('track-current-status-badge');
        if (badge) {
          badge.textContent = '💤 Queue Empty';
          badge.style.background = '#f1f5f9';
          badge.style.color = '#64748b';
        }
      }
      return;
    }

    // Track tab displays
    const tokenDisplay = document.getElementById('track-token-display');
    if (tokenDisplay) tokenDisplay.textContent = `Token: ${active.token}`;
    const dispActiveToken = document.getElementById('disp-active-token');
    if (dispActiveToken) dispActiveToken.textContent = active.token;
    const studentSideToken = document.getElementById('student-side-token');
    if (studentSideToken) studentSideToken.innerHTML = `Token: <strong>${active.token}</strong>`;

    const itemsElem = document.getElementById('track-order-items-list');
    if (itemsElem) {
      itemsElem.innerHTML = active.items.map(i => `
        <div class="aot-item-row">
          <span>${i.name} × ${i.qty}</span>
          <strong>₹${i.price * i.qty}</strong>
        </div>
      `).join('');
    }

    const payElem = document.getElementById('track-order-payment');
    if (payElem) payElem.textContent = active.paymentMethod;
    const totElem = document.getElementById('track-order-total');
    if (totElem) totElem.textContent = `₹${active.total}`;

    // Dynamic 4-Step Timeline & Status Badge
    const statusBadge = document.getElementById('track-current-status-badge');
    const stepNode1 = document.getElementById('step-node-1');
    const stepConn1 = document.getElementById('step-conn-1');
    const stepNode2 = document.getElementById('step-node-2');
    const stepConn2 = document.getElementById('step-conn-2');
    const stepNode3 = document.getElementById('step-node-3');
    const stepConn3 = document.getElementById('step-conn-3');
    const stepNode4 = document.getElementById('step-node-4');
    const readyBanner = document.getElementById('ready-pickup-banner');
    const rpbToken = document.getElementById('rpb-token');

    if (rpbToken) rpbToken.textContent = active.token;

    // Reset timeline nodes
    [stepNode1, stepNode2, stepNode3, stepNode4].forEach(n => {
      if (n) { n.classList.remove('active', 'completed'); }
    });
    [stepConn1, stepConn2, stepConn3].forEach(c => {
      if (c) { c.classList.remove('active'); }
    });

    if (stepNode1) {
      stepNode1.classList.add('completed');
    }

    if (active.status === 'Pending') {
      if (statusBadge) {
        statusBadge.textContent = '⏳ Order Placed';
        statusBadge.style.background = '#fef3c7';
        statusBadge.style.color = '#92400e';
      }
      if (readyBanner) readyBanner.classList.add('hidden');
    } else if (active.status === 'Preparing') {
      if (statusBadge) {
        statusBadge.textContent = '🍳 Preparing';
        statusBadge.style.background = '#ffedd5';
        statusBadge.style.color = '#9a3412';
      }
      if (stepConn1) stepConn1.classList.add('active');
      if (stepNode2) stepNode2.classList.add('active');
      if (readyBanner) readyBanner.classList.add('hidden');
    } else if (active.status === 'Ready') {
      if (statusBadge) {
        statusBadge.textContent = '🔔 Ready for Pickup';
        statusBadge.style.background = '#dcfce7';
        statusBadge.style.color = '#166534';
      }
      if (stepConn1) stepConn1.classList.add('active');
      if (stepNode2) stepNode2.classList.add('completed');
      if (stepConn2) stepConn2.classList.add('active');
      if (stepNode3) {
        stepNode3.classList.add('active', 'completed');
      }
      if (readyBanner) readyBanner.classList.remove('hidden');
    } else if (active.status === 'Collected') {
      if (statusBadge) {
        statusBadge.textContent = '🍽️ Meal Collected';
        statusBadge.style.background = '#e0f2fe';
        statusBadge.style.color = '#0369a1';
      }
      if (stepConn1) stepConn1.classList.add('active');
      if (stepNode2) stepNode2.classList.add('completed');
      if (stepConn2) stepConn2.classList.add('active');
      if (stepNode3) stepNode3.classList.add('completed');
      if (stepConn3) stepConn3.classList.add('active');
      if (stepNode4) stepNode4.classList.add('active', 'completed');
      if (readyBanner) readyBanner.classList.add('hidden');
    }

    this.renderProfileBarcode(active.token);
  }

  simulateOrderStep() {
    const active = this.getActiveOrder();
    if (!active) {
      this.showToast('No active orders found. Please reserve a meal first!', '⚠️');
      return;
    }

    if (active.status === "Pending") {
      active.status = "Preparing";
      this.showToast(`Order ${active.token} is now Preparing on stoves!`, '🍳');
    } else if (active.status === "Preparing") {
      active.status = "Ready";
      this.triggerOrderReadyState(active.token);
      this.showToast(`Order ${active.token} is READY for pickup at counter!`, '🔔');
    } else if (active.status === "Ready") {
      active.status = "Collected";
      this.markOrderCollected(active.token);
    } else {
      active.status = "Pending";
      this.showToast(`Order ${active.token} reset to Pending for demo.`, '🔄');
    }

    this.syncAllPortals();
  }

  markOrderCollected(token = null) {
    const active = token ? this.orders.find(o => o.token === token) : this.getActiveOrder();
    if (active) {
      active.status = "Collected";
    }

    const banner = document.getElementById('ready-pickup-banner');
    if (banner) banner.classList.add('hidden');

    const stepNode4 = document.getElementById('step-node-4');
    if (stepNode4) {
      stepNode4.classList.add('active', 'completed');
    }
    const stepConn3 = document.getElementById('step-conn-3');
    if (stepConn3) stepConn3.classList.add('active');

    const statusBadge = document.getElementById('track-current-status-badge');
    if (statusBadge) {
      statusBadge.textContent = "🍽️ Collected";
      statusBadge.style.background = "#e0f2fe";
      statusBadge.style.color = "#0369a1";
    }

    this.showToast(`Meal ${active ? active.token : ''} marked as collected! Enjoy dining inside the canteen.`, '🍽️');
    this.syncAllPortals();
  }

  renderStudentOrdersHistory() {
    const tbody = document.getElementById('student-history-tbody');
    if (!tbody) return;

    if (this.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No orders placed yet. Reserve a delicious meal to see history.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.orders.map(o => {
      let badgeClass = 'badge-primary';
      let badgeStyle = '';
      if (o.status === 'Ready') badgeClass = 'badge-green';
      else if (o.status === 'Preparing') badgeClass = 'badge-accent';
      else if (o.status === 'Collected') badgeClass = 'badge-blue';
      else if (o.status === 'Cancelled') {
        badgeClass = 'badge-accent';
        badgeStyle = 'background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;';
      }

      let actionHtml = '';
      if (o.status === 'Preparing' || o.status === 'Pending' || o.status === 'Ready') {
        actionHtml = `<button class="btn btn-xs btn-outline-danger" onclick="app.cancelStudentOrder('${o.token}')" title="Cancel this meal reservation">Cancel</button>`;
      } else if (o.status === 'Collected') {
        actionHtml = `<span style="font-size:0.8rem; color:var(--accent-green); font-weight:600;">✓ Done</span>`;
      } else if (o.status === 'Cancelled') {
        actionHtml = `<span style="font-size:0.8rem; color:#dc2626; font-weight:500;">Restocked</span>`;
      }

      return `
        <tr>
          <td><strong style="font-family: monospace; color: var(--primary-maroon);">${o.token}</strong></td>
          <td>${o.timestamp}</td>
          <td>${o.items.map(i => `${i.name} × ${i.qty}`).join(', ')}</td>
          <td><strong>₹${o.total}</strong></td>
          <td>${o.paymentMethod}</td>
          <td><span class="badge ${badgeClass}" style="${badgeStyle}">${o.status}</span></td>
          <td>${actionHtml}</td>
        </tr>
      `;
    }).join('');
  }

  cancelStudentOrder(token) {
    const order = this.orders.find(o => o.token === token);
    if (!order) {
      this.showToast('Order not found.', '⚠️');
      return;
    }

    if (order.status === 'Collected') {
      this.showToast('Collected meals cannot be cancelled.', '⚠️');
      return;
    }

    if (order.status === 'Cancelled') {
      this.showToast('Order is already cancelled.', 'ℹ️');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to cancel order ${token}? Reserved portions will be restored to canteen stock.`);
    if (!confirmed) return;

    order.status = 'Cancelled';

    // Restock items in real-time
    if (Array.isArray(order.items)) {
      order.items.forEach(item => {
        const food = CANTEEN_DATA.menu.find(f => f.name.toLowerCase() === item.name.toLowerCase());
        if (food) {
          food.dailyStock = (food.dailyStock || 0) + item.qty;
          food.inStock = true;
          food.soldCount = Math.max(0, (food.soldCount || item.qty) - item.qty);
        }

        const dem = CANTEEN_DATA.foodDemand ? CANTEEN_DATA.foodDemand.find(d => d.name.toLowerCase() === item.name.toLowerCase()) : null;
        if (dem) {
          dem.sold = Math.max(0, (dem.sold || 0) - item.qty);
          dem.remaining = (dem.remaining || 0) + item.qty;
        }
      });
    }

    // Call backend API asynchronously
    try {
      fetch(`/api/orders/${encodeURIComponent(token)}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      }).catch(err => console.log('Backend sync offline:', err));
    } catch (e) {
      // offline fallback
    }

    // Add notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Order Cancelled & Restocked',
      body: `Order ${token} (₹${order.total}) was cancelled. Food portions were returned to inventory.`,
      time: 'Just now',
      icon: '❌',
      read: false,
      type: 'warning'
    });

    this.playAudioChime('beep');
    this.showToast(`Order ${token} cancelled and stock replenished.`, '❌');
    this.syncAllPortals();
  }

  /* -------------------------------------------------------------
     6. NOTIFICATIONS & LIVE CROWD STATUS (Sections 12, 17, 19)
     ------------------------------------------------------------- */
  renderStudentNotifications() {
    const feed = document.getElementById('student-notifs-feed');
    if (!feed) return;

    feed.innerHTML = this.notifications.map(n => `
      <div class="notif-card ${n.read ? '' : 'unread'} alert-${n.type}">
        <div class="notif-icon-circle">${n.icon}</div>
        <div>
          <div class="notif-title">${n.title}</div>
          <div class="notif-body">${n.body}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');

    this.updateNotifBadges();
  }

  updateNotifBadges() {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    document.querySelectorAll('#student-notif-badge, #snav-notif-badge').forEach(b => b.textContent = unreadCount);
  }

  markAllStudentNotifsRead() {
    this.notifications.forEach(n => n.read = true);
    this.renderStudentNotifications();
    this.showToast('All notifications marked as read.', '✓');
  }

  renderDeptScheduleTable() {
    const tbody = document.getElementById('student-dept-schedule-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.departments.map(d => `
      <tr>
        <td><strong>${d.code}</strong> (${d.name})</td>
        <td>${d.breakTime}</td>
        <td><strong class="text-maroon">${d.departureWindow}</strong></td>
        <td>${d.expectedArrival}</td>
        <td>${d.studentsCount} Students</td>
        <td>${d.impact}</td>
      </tr>
    `).join('');
  }

  refreshCrowdSimulation() {
    const activeKitchenCount = this.orders.filter(o => o.status === 'Preparing' || o.status === 'Ready').length;
    // Ground simulated crowd realistically around active kitchen orders and campus flow
    const dynamicCrowd = Math.min(95, Math.max(15, 32 + (activeKitchenCount * 5) + Math.floor(Math.random() * 8)));
    const capacity = 100;
    const pct = Math.round((dynamicCrowd / capacity) * 100);

    const bar = document.getElementById('canteen-meter-bar');
    const pctElem = document.getElementById('canteen-meter-pct');
    const badge = document.getElementById('canteen-meter-badge');
    const currentElem = document.getElementById('canteen-count-current');
    const availElem = document.getElementById('canteen-count-avail');
    const microFill = document.getElementById('micro-crowd-fill');
    const microLabel = document.getElementById('micro-crowd-label');
    const microCount = document.getElementById('micro-crowd-count');

    if (bar) bar.style.width = `${pct}%`;
    if (pctElem) pctElem.textContent = `${pct}%`;
    if (currentElem) currentElem.textContent = dynamicCrowd;
    if (availElem) availElem.textContent = capacity - dynamicCrowd;
    if (microFill) microFill.style.width = `${pct}%`;
    if (microCount) microCount.textContent = `${dynamicCrowd} / ${capacity}`;

    let statusText = '🟢 LOW CROWD';
    let statusColor = '#2e7d32';
    let statusBg = '#e8f5e9';

    if (pct > 75) {
      statusText = '🔴 HIGH CROWD';
      statusColor = '#dc2626';
      statusBg = '#fee2e2';
    } else if (pct > 50) {
      statusText = '🟡 MEDIUM CROWD';
      statusColor = '#ca8a04';
      statusBg = '#fef9c3';
    }

    if (badge) {
      badge.textContent = statusText;
      badge.style.color = statusColor;
      badge.style.background = statusBg;
    }
    if (microLabel) microLabel.textContent = statusText;

    this.showToast(`Telemetry updated: ${dynamicCrowd} students currently inside.`, '📡');
  }

  /* -------------------------------------------------------------
     7. STAFF PORTAL LOGIC & QUEUES (Sections 13 & 14)
     ------------------------------------------------------------- */
  initStaffPortal() {
    this.renderStaffMetrics();
    this.renderStaffLiveStream();
    this.renderStaffArrivalWaves();
    this.renderStaffQueueGrid('all');
    this.renderStaffDemandTable();
    this.renderStaffDemandChart();
    this.renderStaffCrowdChart();
  }

  showStaffView(viewId) {
    document.querySelectorAll('.staff-view-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#staff-sidebar .sidebar-nav-item').forEach(b => b.classList.remove('active'));

    const pane = document.getElementById(`sfview-${viewId}`);
    if (pane) pane.classList.add('active');

    const navBtn = document.getElementById(`sfnav-${viewId === 'dashboard' ? 'dash' : viewId}`);
    if (navBtn) navBtn.classList.add('active');

    if (viewId === 'demand') this.renderStaffDemandChart();
    if (viewId === 'canteen') this.renderStaffCrowdChart();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderStaffMetrics() {
    const total = this.orders.length + 180;
    const preparing = this.orders.filter(o => o.status === 'Preparing').length + 22;
    const ready = this.orders.filter(o => o.status === 'Ready').length + 11;
    const completed = 151;

    document.getElementById('sf-stat-total').textContent = total;
    document.getElementById('sf-stat-preparing').textContent = preparing;
    document.getElementById('sf-stat-ready').textContent = ready;
    document.getElementById('sf-stat-completed').textContent = completed;
    document.getElementById('sf-pending-badge').textContent = preparing;
  }

  renderStaffLiveStream() {
    const stream = document.getElementById('sf-live-orders-stream');
    if (!stream) return;

    stream.innerHTML = this.orders.slice(0, 4).map(o => `
      <div class="stream-order-card">
        <div class="soc-header">
          <span class="soc-token">${o.token}</span>
          <span class="badge ${o.status === 'Ready' ? 'badge-green' : o.status === 'Preparing' ? 'badge-accent' : 'badge-primary'}">${o.status}</span>
        </div>
        <div class="soc-items">${o.items.map(i => `${i.name} × ${i.qty}`).join(', ')}</div>
        <div class="soc-footer">
          <span>${o.studentName} (${o.department}) &bull; Arrival: <strong>${o.arrivalTime}</strong></span>
          <div class="soc-actions">
            <button class="btn btn-xs btn-outline" onclick="app.updateStaffOrderStatus('${o.token}', 'Ready')">Ready</button>
            <button class="btn btn-xs btn-success" onclick="app.updateStaffOrderStatus('${o.token}', 'Collected')">Done</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderStaffArrivalWaves() {
    const waves = document.getElementById('sf-arrival-waves-list');
    if (!waves) return;

    waves.innerHTML = CANTEEN_DATA.departments.slice(0, 5).map(d => `
      <div class="stream-order-card" style="border-left: 4px solid var(--primary-maroon);">
        <div class="soc-header">
          <strong>${d.code} (${d.name})</strong>
          <span class="badge badge-accent">${d.studentsCount} Students</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          Leaves class: <strong>${d.departureWindow}</strong> &bull; Reaches counter: <strong>${d.expectedArrival}</strong>
        </div>
      </div>
    `).join('');
  }

  handleKitchenSearch(val) {
    this.kitchenQueueSearch = (val || '').toLowerCase().trim();
    this.renderStaffQueueGrid();
  }

  filterStaffQueue(filter, btn) {
    document.querySelectorAll('#sfview-incoming .filter-pill').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.kitchenQueueFilter = filter || 'all';
    this.renderStaffQueueGrid();
  }

  renderStaffQueueGrid() {
    const grid = document.getElementById('sf-incoming-cards-grid');
    if (!grid) return;

    const filter = (this.kitchenQueueFilter || 'all').toLowerCase();
    const query = this.kitchenQueueSearch || '';

    let list = filter === 'all'
      ? this.orders
      : this.orders.filter(o => o.status.toLowerCase() === filter);

    if (query) {
      list = list.filter(o =>
        o.token.toLowerCase().includes(query) ||
        o.studentName.toLowerCase().includes(query) ||
        (o.department && o.department.toLowerCase().includes(query)) ||
        (o.studentId && o.studentId.toLowerCase().includes(query)) ||
        (o.items && o.items.some(i => i.name.toLowerCase().includes(query)))
      );
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary); background: white; border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📥</div>
          <h3 style="font-size: 1.05rem; margin-bottom: 0.25rem;">No Kitchen Orders Match</h3>
          <p style="font-size: 0.85rem;">Try clearing your search query or selecting a different status filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(o => `
      <div class="kitchen-order-card status-${o.status.toLowerCase()}">
        <div class="koc-header">
          <span class="koc-token">${o.token}</span>
          <span class="badge ${o.status === 'Ready' ? 'badge-green' : o.status === 'Preparing' ? 'badge-accent' : o.status === 'Collected' ? 'badge-blue' : o.status === 'Cancelled' ? 'badge-accent' : 'badge-primary'}" style="${o.status === 'Cancelled' ? 'background:#fee2e2; color:#b91c1c;' : ''}">${o.status}</span>
        </div>
        <div class="koc-student-dept">
          <strong>${o.studentName}</strong> &bull; ${o.department} (${o.studentId})
        </div>
        <table class="koc-items-table">
          ${o.items.map(i => `
            <tr>
              <td>${i.name}</td>
              <td class="text-right"><strong>× ${i.qty}</strong></td>
            </tr>
          `).join('')}
        </table>
        <div class="koc-meta-row">
          <span>Arrival: <strong>${o.arrivalTime}</strong></span>
          <span>${o.paymentMethod} &bull; <strong>₹${o.total}</strong></span>
        </div>
        ${o.status !== 'Cancelled' ? `
        <div class="koc-action-row">
          <button class="btn btn-xs btn-outline" onclick="app.updateStaffOrderStatus('${o.token}', 'Preparing')">🍳 Preparing</button>
          <button class="btn btn-xs btn-success" onclick="app.updateStaffOrderStatus('${o.token}', 'Ready')">🔔 Ready</button>
          <button class="btn btn-xs btn-primary" onclick="app.updateStaffOrderStatus('${o.token}', 'Collected')">🍽️ Collected</button>
        </div>
        ` : `
        <div class="koc-action-row" style="justify-content: flex-end;">
          <span style="font-size: 0.8rem; color: #dc2626; font-weight: 600;">Cancelled &amp; Restocked</span>
        </div>
        `}
      </div>
    `).join('');
  }

  updateStaffOrderStatus(token, newStatus) {
    const order = this.orders.find(o => o.token === token);
    if (!order) return;

    order.status = newStatus;
    this.renderStaffMetrics();
    this.renderStaffLiveStream();
    this.renderStaffQueueGrid(document.querySelector('#sfview-incoming .filter-pill.active')?.textContent.toLowerCase() || 'all');

    this.showToast(`Token ${token} updated to ${newStatus}.`, '👨‍🍳');

    // If it belongs to currently logged in student or matches active order, sync live view
    const activeOrder = this.getActiveOrder();
    if (activeOrder && activeOrder.token === token) {
      if (newStatus === "Ready") {
        this.triggerOrderReadyState(token);
      } else if (newStatus === "Collected") {
        this.markOrderCollected(token);
      } else {
        this.updateActiveOrderDisplay(order);
      }
    }
    this.syncAllPortals();
  }

  /* Staff Barcode / Token Scanner & Workflow Tools */
  scanTokenFromInput() {
    const input = document.getElementById('staff-scanner-input') || document.getElementById('staff-scan-input');
    if (!input) return;
    const token = input.value.trim().toUpperCase();
    if (!token) {
      this.showToast('Please type or scan an Order Token ID (e.g. SC-101)', '⚠️');
      return;
    }

    const order = this.orders.find(o => o.token.toUpperCase() === token);
    if (!order) {
      this.playAudioChime('beep');
      this.showToast(`Order Token '${token}' not found in active queue.`, '❌');
      return;
    }

    if (order.status === 'Preparing') {
      this.updateStaffOrderStatus(order.token, 'Ready');
      this.playAudioChime('success');
      this.showToast(`Scanned ${order.token}: Marked READY for counter pickup!`, '🔔');
    } else if (order.status === 'Ready') {
      this.updateStaffOrderStatus(order.token, 'Collected');
      this.playAudioChime('coin');
      this.showToast(`Scanned ${order.token}: Meal COLLECTED by student.`, '✅');
    } else {
      this.playAudioChime('beep');
      this.showToast(`Token ${order.token} is already ${order.status}.`, 'ℹ️');
    }

    input.value = '';
    input.focus();
  }

  batchMarkAllReady() {
    const preparingOrders = this.orders.filter(o => o.status === 'Preparing');
    if (preparingOrders.length === 0) {
      this.showToast('No orders are currently in Preparing state.', 'ℹ️');
      return;
    }

    preparingOrders.forEach(o => {
      o.status = 'Ready';
    });

    this.renderStaffMetrics();
    this.renderStaffLiveStream();
    this.renderStaffQueueGrid('all');
    this.triggerOrderReadyState();
    this.playAudioChime('bell');
    this.showToast(`Batch updated: All ${preparingOrders.length} preparing orders marked READY!`, '📢');
  }

  toggleKodMode() {
    this.isKodMode = !this.isKodMode;
    const container = document.getElementById('sfview-incoming');
    const btn = document.getElementById('btn-toggle-kod');
    if (container) {
      container.classList.toggle('kod-mode-active', this.isKodMode);
    }
    if (btn) {
      btn.textContent = this.isKodMode ? '🖥️ Exit KOD Mode' : '🖥️ Kitchen Display (KOD)';
    }
    this.showToast(this.isKodMode ? 'Kitchen Display Mode activated (High Visibility)' : 'Returned to standard staff view', '🖥️');
  }

  simulateRandomNewOrder() {
    const token = `SC-${Math.floor(130 + Math.random() * 50)}`;
    const newOrd = {
      token: token,
      studentId: "LM2026ME088",
      studentName: "Jibin Mathew",
      department: "ME",
      items: [{ name: "Puffs", qty: 2, price: 25 }, { name: "Tea", qty: 1, price: 15 }],
      total: 65,
      paymentMethod: "UPI / Google Pay",
      arrivalTime: "11:05 AM",
      departureTime: "11:00 AM",
      status: "Preparing",
      timestamp: "Just Now",
      prepRemainingSeconds: 300
    };

    this.orders.unshift(newOrd);
    this.renderStaffMetrics();
    this.renderStaffLiveStream();
    this.renderStaffQueueGrid('all');
    this.playAudioChime('bell');
    this.showToast(`New reservation incoming: Token ${token} (ME Department)`, '🔔');
  }

  renderStaffDemandTable() {
    const tbody = document.getElementById('sf-demand-table-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.foodDemand.map(d => `
      <tr>
        <td><strong>${d.name}</strong></td>
        <td><strong class="text-orange">${d.expectedDemand} portions</strong></td>
        <td><strong class="text-green">${d.planned} portions</strong></td>
        <td>${d.readyStock} ready</td>
        <td><span class="badge badge-primary">${d.kitchenAction}</span></td>
      </tr>
    `).join('');
  }

  printKitchenSheet() {
    window.print();
  }

  /* -------------------------------------------------------------
     8. ADMIN PORTAL LOGIC & ANALYTICS (Sections 15, 16, 17, 18)
     ------------------------------------------------------------- */
  initAdminPortal() {
    this.renderAdminMetrics();
    this.renderAdminOrdersMasterTable();
    this.renderAdminMenuTable();
    this.renderAdminDemandAnalytics();
    this.renderAdminUsersTable();
    this.renderAdminCharts();
    this.renderAdminDeptScheduleTable();
  }

  showAdminView(viewId) {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Administrator privileges required.', '⛔');
      if (this.currentUser && this.currentUser.role === 'student') {
        this.showStudentView('dashboard');
      } else if (this.currentUser && this.currentUser.role === 'staff') {
        this.showStaffView('queue');
      } else {
        this.logout();
      }
      return;
    }

    document.querySelectorAll('.admin-view-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#admin-sidebar .sidebar-nav-item').forEach(b => b.classList.remove('active'));

    const pane = document.getElementById(`adview-${viewId}`);
    if (pane) pane.classList.add('active');

    const navBtn = document.getElementById(`adnav-${viewId === 'dashboard' ? 'dash' : viewId}`);
    if (navBtn) navBtn.classList.add('active');

    if (viewId === 'dashboard' || viewId === 'crowd' || viewId === 'demand' || viewId === 'revenue') {
      setTimeout(() => this.renderAdminCharts(), 50);
    }
    if (viewId === 'dashboard') {
      this.renderAdminMetrics();
    }
    if (viewId === 'settings') {
      this.renderAdminDeptScheduleTable();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderAdminMetrics() {
    const dynamicRevenue = this.orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const totalRevenue = 18450 + dynamicRevenue;
    const totalExpenses = 11250 + Math.round(dynamicRevenue * 0.45);
    const totalProfit = Math.max(0, totalRevenue - totalExpenses);
    const totalOrdersCount = 180 + this.orders.length;
    const uniqueStudents = new Set(this.orders.map(o => o.studentId)).size + 295;

    const revElem = document.getElementById('ad-stat-revenue');
    if (revElem) revElem.textContent = `₹${totalRevenue.toLocaleString()}`;

    const expElem = document.getElementById('ad-stat-expenses');
    if (expElem) expElem.textContent = `₹${totalExpenses.toLocaleString()}`;

    const profElem = document.getElementById('ad-stat-profit');
    if (profElem) profElem.textContent = `₹${totalProfit.toLocaleString()}`;

    const ordElem = document.getElementById('ad-stat-orders');
    if (ordElem) ordElem.textContent = `${totalOrdersCount}`;

    const stuElem = document.getElementById('ad-stat-students');
    if (stuElem) stuElem.textContent = `${uniqueStudents}`;
  }

  handleAdminOrdersSearch(val) {
    this.adminOrdersSearch = (val || '').toLowerCase().trim();
    this.renderAdminOrdersMasterTable();
  }

  handleAdminOrdersFilter(val) {
    this.adminOrdersFilter = (val || 'all').toLowerCase();
    this.renderAdminOrdersMasterTable();
  }

  renderAdminOrdersMasterTable() {
    const tbody = document.getElementById('ad-orders-master-tbody');
    if (!tbody) return;

    const filter = (this.adminOrdersFilter || 'all').toLowerCase();
    const query = this.adminOrdersSearch || '';

    let list = filter === 'all'
      ? this.orders
      : this.orders.filter(o => o.status.toLowerCase() === filter);

    if (query) {
      list = list.filter(o =>
        o.token.toLowerCase().includes(query) ||
        o.studentName.toLowerCase().includes(query) ||
        (o.department && o.department.toLowerCase().includes(query)) ||
        (o.studentId && o.studentId.toLowerCase().includes(query)) ||
        (o.items && o.items.some(i => i.name.toLowerCase().includes(query)))
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 2.5rem; color: var(--text-secondary);">No orders match the selected search and status filters.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(o => {
      let badgeClass = 'badge-primary';
      let badgeStyle = '';
      if (o.status === 'Ready') badgeClass = 'badge-green';
      else if (o.status === 'Preparing') badgeClass = 'badge-accent';
      else if (o.status === 'Collected') badgeClass = 'badge-blue';
      else if (o.status === 'Cancelled') {
        badgeClass = 'badge-accent';
        badgeStyle = 'background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;';
      }

      return `
        <tr>
          <td><strong style="font-family: monospace; color: var(--primary-maroon);">${o.token}</strong></td>
          <td>${o.studentName}</td>
          <td>${o.department} &bull; <code>${o.studentId}</code></td>
          <td>${o.items.map(i => `${i.name} (${i.qty})`).join(', ')}</td>
          <td><strong>₹${o.total}</strong></td>
          <td>${o.paymentMethod}</td>
          <td><span class="badge ${badgeClass}" style="${badgeStyle}">${o.status}</span></td>
          <td>Leave ${o.departureTime} → Arrive ${o.arrivalTime}</td>
        </tr>
      `;
    }).join('');
  }

  renderAdminMenuTable() {
    const tbody = document.getElementById('ad-menu-table-tbody');
    if (!tbody) return;

    let items = [...CANTEEN_DATA.menu];
    if (this.adminMenuStock === 'instock') {
      items = items.filter(f => f.inStock && (typeof f.dailyStock !== 'number' || f.dailyStock > 0));
    } else if (this.adminMenuStock === 'outofstock') {
      items = items.filter(f => !f.inStock || (typeof f.dailyStock === 'number' && f.dailyStock <= 0));
    }

    const inStockCount = CANTEEN_DATA.menu.filter(f => f.inStock && (typeof f.dailyStock !== 'number' || f.dailyStock > 0)).length;
    const outStockCount = CANTEEN_DATA.menu.length - inStockCount;

    const statsElem = document.getElementById('admin-menu-stock-stats');
    if (statsElem) {
      statsElem.innerHTML = `Showing <strong>${items.length}</strong> of ${CANTEEN_DATA.menu.length} items &bull; <span style="color:#16a34a; font-weight:600;">${inStockCount} In Stock</span> &bull; <span style="color:#dc2626; font-weight:600;">${outStockCount} Out of Stock</span>`;
    }

    tbody.innerHTML = items.map(f => {
      const isOut = !f.inStock || (typeof f.dailyStock === 'number' && f.dailyStock <= 0);
      return `
        <tr>
          <td><img src="${f.image}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;" /></td>
          <td><strong>${f.name}</strong></td>
          <td><span class="badge badge-primary">${f.category}</span></td>
          <td><strong>₹${f.price}</strong></td>
          <td>${f.dailyStock || 0} portions</td>
          <td><span class="badge ${!isOut ? 'badge-green' : 'badge-accent'}" style="${!isOut ? 'background:#dcfce7; color:#166534;' : 'background:#fee2e2; color:#991b1b;'}">${!isOut ? '🟢 In Stock' : '🔴 Out of Stock'}</span></td>
          <td>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
              <button class="btn btn-xs ${isOut ? 'btn-primary' : 'btn-outline'}" onclick="app.toggleMenuStock('${f.id}')">${isOut ? 'Restock Item' : 'Mark Out of Stock'}</button>
              <button class="btn btn-xs btn-outline-danger" onclick="app.deleteAdminMenuItem('${f.id}')" title="Delete menu dish">Delete</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  filterAdminMenuStock(stock, btn) {
    document.querySelectorAll('.admin-stock-btn').forEach(b => {
      b.classList.remove('active');
      b.classList.remove('btn-primary');
      b.classList.add('btn-outline');
    });
    if (btn) {
      btn.classList.add('active');
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-primary');
    }
    this.adminMenuStock = stock;
    this.renderAdminMenuTable();
  }

  toggleMenuStock(id) {
    const item = CANTEEN_DATA.menu.find(f => f.id === id);
    if (!item) return;
    item.inStock = !item.inStock;
    if (item.inStock && (!item.dailyStock || item.dailyStock <= 0)) {
      item.dailyStock = 30;
    } else if (!item.inStock) {
      item.dailyStock = 0;
    }
    this.renderAdminMenuTable();
    this.renderStudentFoodGrid();
    this.renderPublicMenu();
    this.showToast(`Updated "${item.name}" stock to ${item.inStock ? 'In Stock (30 portions)' : 'Out of Stock'}.`, item.inStock ? '🟢' : '🔴');
  }

  /* Custom Admin Add Food Modal (Replaces browser window.prompt) */
  openAddMenuModal() {
    const modal = document.getElementById('admin-food-modal');
    if (modal) {
      modal.classList.add('active');
      const input = document.getElementById('new-food-name');
      if (input) setTimeout(() => input.focus(), 100);
    }
  }

  closeAdminFoodModal() {
    const modal = document.getElementById('admin-food-modal');
    if (modal) modal.classList.remove('active');
  }

  handleSaveAdminFood(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('new-food-name')?.value.trim();
    if (!name) {
      this.showToast('Please enter a dish name.', '⚠️');
      return;
    }

    const cat = document.getElementById('new-food-cat')?.value || 'snacks';
    const price = parseInt(document.getElementById('new-food-price')?.value, 10) || 50;
    const stock = parseInt(document.getElementById('new-food-stock')?.value, 10) || 30;
    const cal = parseInt(document.getElementById('new-food-cal')?.value, 10) || 240;
    const prep = document.getElementById('new-food-prep')?.value.trim() || '5m';
    const isVeg = document.getElementById('new-food-veg')?.value === 'true';
    const tag = document.getElementById('new-food-tag')?.value.trim() || '';
    const desc = document.getElementById('new-food-desc')?.value.trim() || 'Freshly prepared at Lourdes Matha College canteen.';
    let img = document.getElementById('new-food-img')?.value.trim();

    if (!img) {
      img = isVeg 
        ? 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80';
    }

    const newItem = {
      id: `f${CANTEEN_DATA.menu.length + 1}`,
      name: name,
      category: cat,
      price: price,
      isVeg: isVeg,
      description: desc,
      image: img,
      inStock: true,
      dailyStock: stock,
      soldCount: 0,
      isPopular: !!tag,
      calories: cal,
      prepTime: prep,
      rating: 4.8,
      tags: tag ? [tag] : []
    };

    CANTEEN_DATA.menu.push(newItem);
    this.renderAdminMenuTable();
    this.renderStudentFoodGrid('all');
    this.renderPublicMenu();
    this.playAudioChime('success');
    this.showToast(`Added ${name} (₹${price}) to campus menu!`, '✅');
    this.closeAdminFoodModal();

    const form = document.getElementById('admin-food-form');
    if (form) form.reset();
  }

  /* Admin CSV Data Export Features */
  exportOrdersCsv() {
    if (this.orders.length === 0) {
      this.showToast('No orders available to export.', 'ℹ️');
      return;
    }

    let csvContent = 'Token,Student Name,Student ID,Department,Items,Total (INR),Payment Method,Departure Time,Arrival Time,Status,Timestamp\n';

    this.orders.forEach(o => {
      const itemsStr = `"${o.items.map(i => `${i.name} (x${i.qty})`).join('; ')}"`;
      const row = [
        o.token,
        `"${o.studentName}"`,
        o.studentId,
        o.department,
        itemsStr,
        o.total,
        `"${o.paymentMethod}"`,
        o.departureTime,
        o.arrivalTime,
        o.status,
        `"${o.timestamp}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LMCST_Canteen_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.playAudioChime('coin');
    this.showToast('Orders exported to CSV successfully!', '📥');
  }

  exportDemandCsv() {
    let csvContent = 'Item Name,Expected Demand,Planned Portions,Ready Stock,Sold Portions,Remaining,Waste Pct,Kitchen Action\n';

    CANTEEN_DATA.foodDemand.forEach(d => {
      const row = [
        `"${d.name}"`,
        d.expectedDemand,
        d.planned,
        d.readyStock,
        d.sold,
        d.remaining,
        `"${d.wastePct}"`,
        `"${d.kitchenAction}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LMCST_Kitchen_Demand_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.playAudioChime('coin');
    this.showToast('Kitchen Demand exported to CSV successfully!', '📥');
  }

  /* Reset Stagger Timings to Balanced Campus Defaults */
  resetDefaultTimings() {
    const defaults = [
      { code: "CS", departureWindow: "11:04 AM", expectedArrival: "11:09 AM" },
      { code: "EC", departureWindow: "11:00 AM", expectedArrival: "11:05 AM" },
      { code: "ME", departureWindow: "11:08 AM", expectedArrival: "11:13 AM" },
      { code: "EEE", departureWindow: "11:00 AM", expectedArrival: "11:05 AM" },
      { code: "CE", departureWindow: "11:04 AM", expectedArrival: "11:09 AM" },
      { code: "AI", departureWindow: "11:08 AM", expectedArrival: "11:13 AM" },
      { code: "MBA", departureWindow: "11:00 AM", expectedArrival: "11:05 AM" },
      { code: "MCA", departureWindow: "11:04 AM", expectedArrival: "11:09 AM" }
    ];

    defaults.forEach(def => {
      const dept = CANTEEN_DATA.departments.find(d => d.code === def.code);
      if (dept) {
        dept.departureWindow = def.departureWindow;
        dept.expectedArrival = def.expectedArrival;
      }
      CANTEEN_DATA.users.forEach(u => {
        if (u.department === def.code) {
          u.assignedDeparture = def.departureWindow;
          u.assignedArrival = def.expectedArrival;
        }
      });
    });

    if (this.currentUser) {
      const match = defaults.find(d => d.code === this.currentUser.department);
      if (match) {
        this.currentUser.assignedDeparture = match.departureWindow;
        this.currentUser.assignedArrival = match.expectedArrival;
      }
    }

    this.renderDeptScheduleTable();
    this.renderDeptSwitchButtons();
    this.renderAdminDeptScheduleTable();
    this.playAudioChime('bell');
    this.showToast('Stagger schedule restored to recommended campus balance.', '⏱️');
  }

  renderAdminDemandAnalytics() {
    const tbody = document.getElementById('ad-demand-analytics-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.foodDemand.map(d => `
      <tr>
        <td><strong>${d.name}</strong></td>
        <td>${d.planned}</td>
        <td>${d.prepared}</td>
        <td><strong class="text-green">${d.sold}</strong></td>
        <td>${d.remaining}</td>
        <td><strong class="${parseFloat(d.wastePct) > 10 ? 'text-orange' : 'text-green'}">${d.wastePct}</strong></td>
        <td><span class="badge ${d.remaining <= 3 ? 'badge-green' : 'badge-accent'}">${d.remaining <= 3 ? 'Optimal Prep' : 'Surplus'}</span></td>
      </tr>
    `).join('');
  }

  renderAdminUsersTable() {
    const tbody = document.getElementById('ad-users-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.users.map(u => `
      <tr>
        <td><code>${u.id}</code></td>
        <td><strong>${u.name}</strong></td>
        <td><span class="badge ${u.role === 'admin' ? 'badge-blue' : u.role === 'staff' ? 'badge-accent' : 'badge-primary'}">${u.role.toUpperCase()}</span></td>
        <td>${u.department}</td>
        <td>${u.year}</td>
        <td><span class="badge badge-green">Active Campus ID</span></td>
      </tr>
    `).join('');
  }

  saveCapacitySettings() {
    const cap = document.getElementById('cfg-capacity').value;
    const walk = document.getElementById('cfg-walk-time').value;
    const intv = document.getElementById('cfg-interval').value;

    CANTEEN_DATA.college.canteenCapacity = parseInt(cap, 10);
    CANTEEN_DATA.college.walkingTimeMinutes = parseInt(walk, 10);

    this.showToast(`Canteen settings saved: Capacity ${cap}, Walking ${walk} mins, Stagger interval ${intv} mins.`, '⚙️');
  }

  renderAdminDeptScheduleTable() {
    const tbody = document.getElementById('ad-dept-schedule-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.departments.map(d => {
      const safeId = d.code.replace(/[^a-zA-Z0-9]/g, '_');
      return `
        <tr>
          <td><strong>${d.name}</strong> <span class="badge badge-primary" style="margin-left: 0.25rem;">${d.code}</span></td>
          <td><span class="badge badge-accent">${d.group}</span></td>
          <td>
            <input type="text" id="cfg-dep-${safeId}" class="form-control form-control-sm" value="${d.departureWindow}" style="width: 120px;" />
          </td>
          <td>
            <input type="text" id="cfg-arr-${safeId}" class="form-control form-control-sm" value="${d.expectedArrival}" style="width: 120px;" />
          </td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="app.updateDepartmentTiming('${d.code}')">
              Update
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  async updateDepartmentTiming(deptCode) {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can modify department departure timings.', '⛔');
      return;
    }

    const safeId = deptCode.replace(/[^a-zA-Z0-9]/g, '_');
    const depInput = document.getElementById(`cfg-dep-${safeId}`);
    const arrInput = document.getElementById(`cfg-arr-${safeId}`);

    const newDep = depInput ? depInput.value.trim() : null;
    const newArr = arrInput ? arrInput.value.trim() : null;

    if (!newDep) {
      this.showToast('Please enter a valid departure time.', '⚠️');
      return;
    }

    // Call backend API with admin role header for RBAC verification
    try {
      const res = await fetch(`/api/departments/${encodeURIComponent(deptCode)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': this.currentUser.role
        },
        body: JSON.stringify({
          departureWindow: newDep,
          expectedArrival: newArr,
          role: this.currentUser.role
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        this.showToast(errData.message || 'Access Denied: Admin authorization failed.', '⛔');
        return;
      }
    } catch (e) {
      console.warn("Backend API timing update notice:", e);
    }

    // Update in-memory data so it immediately reflects across all users
    const dept = CANTEEN_DATA.departments.find(d => d.code === deptCode);
    if (dept) {
      dept.departureWindow = newDep;
      if (newArr) dept.expectedArrival = newArr;
    }

    // Also update any student user records that belong to this department
    CANTEEN_DATA.users.forEach(u => {
      if (u.department === deptCode) {
        u.assignedDeparture = newDep;
        if (newArr) u.assignedArrival = newArr;
      }
    });

    if (this.currentUser && this.currentUser.department === deptCode) {
      this.currentUser.assignedDeparture = newDep;
      if (newArr) this.currentUser.assignedArrival = newArr;
    }

    // Re-render all schedule views and displays across the application
    this.renderDeptScheduleTable();
    this.renderDeptSwitchButtons();
    this.renderAdminDeptScheduleTable();

    this.showToast(`Updated ${deptCode} departure timing to ${newDep} (Synchronized campus-wide)`, '✓');
  }

  /* -------------------------------------------------------------
     9. CHART.JS VISUALIZATIONS (Sections 16, 17, 18)
     ------------------------------------------------------------- */
  renderAdminCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Revenue & Expense Trend
    const revCtx = document.getElementById('ad-rev-chart');
    if (revCtx) {
      if (this.charts.adRev) this.charts.adRev.destroy();
      this.charts.adRev = new Chart(revCtx, {
        type: 'line',
        data: {
          labels: ['Fri', 'Sat', 'Mon', 'Tue', 'Wed', 'Thu', 'Today'],
          datasets: [
            {
              label: 'Revenue (₹)',
              data: [14200, 15800, 16900, 17200, 16400, 17800, 18450],
              borderColor: '#16a34a',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Expenses (₹)',
              data: [10500, 11000, 10800, 11200, 10900, 11100, 11250],
              borderColor: '#e65100',
              backgroundColor: 'rgba(230, 81, 0, 0.05)',
              borderDash: [5, 5],
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 2. Crowd Staggering Effect Comparison (Section 17)
    const crowdCompareCtx = document.getElementById('ad-crowd-compare-chart');
    if (crowdCompareCtx) {
      if (this.charts.adCrowdCompare) this.charts.adCrowdCompare.destroy();
      this.charts.adCrowdCompare = new Chart(crowdCompareCtx, {
        type: 'line',
        data: {
          labels: CANTEEN_DATA.crowdFlow.labels,
          datasets: [
            {
              label: 'Controlled Curve (With Smart Staggering)',
              data: CANTEEN_DATA.crowdFlow.withStaggering,
              borderColor: '#16a34a',
              backgroundColor: 'rgba(22, 163, 74, 0.2)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Bottleneck Spike (Without Staggering)',
              data: CANTEEN_DATA.crowdFlow.withoutStaggering,
              borderColor: '#dc2626',
              borderDash: [4, 4],
              tension: 0.4
            },
            {
              label: 'Canteen Capacity Limit (100 Students)',
              data: CANTEEN_DATA.crowdFlow.capacityLimit,
              borderColor: '#64748b',
              borderDash: [2, 2],
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 3. Section 17 Detailed Timeline
    const crowdTimeCtx = document.getElementById('ad-crowd-timeline-chart');
    if (crowdTimeCtx) {
      if (this.charts.adCrowdTime) this.charts.adCrowdTime.destroy();
      this.charts.adCrowdTime = new Chart(crowdTimeCtx, {
        type: 'bar',
        data: {
          labels: ["10:55 AM", "11:00 AM", "11:05 AM (Peak)", "11:10 AM", "11:15 AM", "11:20 AM"],
          datasets: [
            {
              label: 'Active Students in Canteen Hall',
              data: [20, 35, 65, 40, 15, 8],
              backgroundColor: ['#bbf7d0', '#86efac', '#fdba74', '#86efac', '#bbf7d0', '#e2e8f0']
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    // 4. Planned vs Sold Bar Chart (Section 18)
    const demandBarCtx = document.getElementById('ad-demand-bar-chart');
    if (demandBarCtx) {
      if (this.charts.adDemand) this.charts.adDemand.destroy();
      this.charts.adDemand = new Chart(demandBarCtx, {
        type: 'bar',
        data: {
          labels: CANTEEN_DATA.foodDemand.map(d => d.name),
          datasets: [
            {
              label: 'Planned Quantity',
              data: CANTEEN_DATA.foodDemand.map(d => d.planned),
              backgroundColor: '#94a3b8'
            },
            {
              label: 'Sold to Students',
              data: CANTEEN_DATA.foodDemand.map(d => d.sold),
              backgroundColor: '#16a34a'
            },
            {
              label: 'Remaining Portions',
              data: CANTEEN_DATA.foodDemand.map(d => d.remaining),
              backgroundColor: '#e65100'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 5. Category Revenue Breakdown
    const revCatCtx = document.getElementById('ad-rev-category-chart');
    if (revCatCtx) {
      if (this.charts.adRevCat) this.charts.adRevCat.destroy();
      this.charts.adRevCat = new Chart(revCatCtx, {
        type: 'doughnut',
        data: {
          labels: ['Breakfast Specials', 'Meals & Biriyani', 'Hot Snacks', 'Beverages'],
          datasets: [{
            data: [6400, 7850, 3600, 600],
            backgroundColor: ['#720026', '#e65100', '#2e7d32', '#0284c7']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  }

  renderStudentCrowdChart() {
    const ctx = document.getElementById('student-crowd-chart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (this.charts.studentCrowd) this.charts.studentCrowd.destroy();
    this.charts.studentCrowd = new Chart(ctx, {
      type: 'line',
      data: {
        labels: CANTEEN_DATA.crowdFlow.labels,
        datasets: [
          {
            label: 'Today\'s Seated Count',
            data: CANTEEN_DATA.crowdFlow.withStaggering,
            borderColor: '#720026',
            backgroundColor: 'rgba(114, 0, 38, 0.1)',
            fill: true,
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  renderStaffDemandChart() {
    const ctx = document.getElementById('staff-demand-chart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (this.charts.staffDemand) this.charts.staffDemand.destroy();
    this.charts.staffDemand = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: CANTEEN_DATA.foodDemand.map(d => d.name),
        datasets: [
          {
            label: 'Expected Demand',
            data: CANTEEN_DATA.foodDemand.map(d => d.expectedDemand),
            backgroundColor: '#e65100'
          },
          {
            label: 'Ready Stock',
            data: CANTEEN_DATA.foodDemand.map(d => d.readyStock),
            backgroundColor: '#16a34a'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  renderStaffCrowdChart() {
    const ctx = document.getElementById('staff-crowd-chart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (this.charts.staffCrowd) this.charts.staffCrowd.destroy();
    this.charts.staffCrowd = new Chart(ctx, {
      type: 'line',
      data: {
        labels: CANTEEN_DATA.crowdFlow.labels,
        datasets: [
          {
            label: 'Live Hall Density',
            data: CANTEEN_DATA.crowdFlow.withStaggering,
            borderColor: '#e65100',
            backgroundColor: 'rgba(230, 81, 0, 0.15)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  /* -------------------------------------------------------------
     10. CLOCK & TOAST UTILITIES
     ------------------------------------------------------------- */
  startLiveClocks() {
    setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const clock = document.getElementById('staff-live-clock');
      if (clock) clock.textContent = timeStr;
    }, 1000);
  }

  showToast(message, icon = '🔔') {
    const container = document.getElementById('app-toast');
    const msgElem = document.getElementById('toast-message');
    const iconElem = document.getElementById('toast-icon');
    if (!container || !msgElem) return;

    msgElem.textContent = message;
    if (iconElem) iconElem.textContent = icon;
    container.classList.remove('hidden');

    setTimeout(() => {
      container.classList.add('hidden');
    }, 3800);
  }

  setupEventListeners() {
    // Escape key closes modals or floating overlays
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const studentSidebar = document.getElementById('student-sidebar');
        if (studentSidebar) studentSidebar.classList.remove('open');
        this.closeItemModal();
        this.closeCampusWalkModal();
        this.closeTokenPassModal();
        this.closeAdminFoodModal();
      }
    });

    // Close modals when clicking on dark backdrop overlay
    ['item-detail-modal', 'campus-walk-modal', 'token-pass-modal', 'admin-food-modal'].forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('active');
          }
        });
      }
    });
  }

  // --- AI Assistant Logic ---
  toggleAiChat() {
    const chatWindow = document.getElementById('ai-chat-window');
    if (chatWindow) {
      chatWindow.classList.toggle('hidden');
    }
  }

  handleAiInputKey(event) {
    if (event.key === 'Enter') {
      this.processAiChat();
    }
  }

  sendAiMessage(text) {
    const input = document.getElementById('ai-chat-input');
    if (input) {
      input.value = text;
      this.processAiChat();
    }
  }

  processAiChat() {
    const input = document.getElementById('ai-chat-input');
    if (!input || !input.value.trim()) return;
    
    const text = input.value.trim();
    input.value = '';
    
    const body = document.getElementById('ai-chat-body');
    const quickReplies = document.getElementById('ai-quick-replies');
    if (quickReplies) quickReplies.style.display = 'none';

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user-message';
    userMsg.innerHTML = `<div class="msg-content">${text}</div>`;
    body.appendChild(userMsg);
    body.scrollTop = body.scrollHeight;

    // Simulate thinking delay
    setTimeout(() => {
      const response = this.generateAiResponse(text);
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-message ai-message';
      aiMsg.innerHTML = `<div class="msg-content">${response}</div>`;
      body.appendChild(aiMsg);
      body.scrollTop = body.scrollHeight;
    }, 600);
  }

  generateAiResponse(query) {
    const q = query.toLowerCase();
    let recommendations = [];
    
    if (q.includes('spicy')) {
      recommendations = window.CANTEEN_DATA.menu.filter(item => item.tags && item.tags.includes('spicy') || item.name.toLowerCase().includes('biriyani'));
    } else if (q.includes('veg ') || q.includes('vegetarian') || q.includes('pure veg') || q === 'veg') {
      recommendations = window.CANTEEN_DATA.menu.filter(item => item.tags && item.tags.includes('veg'));
    } else if (q.includes('sweet') || q.includes('dessert') || q.includes('drink')) {
      recommendations = window.CANTEEN_DATA.menu.filter(item => item.category === 'beverages' || item.category === 'snacks');
    } else if (q.includes('popular') || q.includes('best') || q.includes('recommend')) {
      recommendations = [...window.CANTEEN_DATA.menu].sort((a,b) => b.soldCount - a.soldCount).slice(0, 3);
    } else if (q.includes('hello') || q.includes('hi')) {
      return "Hello! How can I help you today? I can recommend dishes based on your preferences.";
    } else {
      // Random suggestion
      recommendations = [window.CANTEEN_DATA.menu[Math.floor(Math.random() * window.CANTEEN_DATA.menu.length)]];
    }
    
    if (recommendations.length > 0) {
      const itemsText = recommendations.slice(0,2).map(item => `<b>${item.name}</b> (₹${item.price})`).join(' and ');
      return `I highly recommend ${itemsText}! 😋 Would you like to order that?`;
    } else {
      return "Hmm, I couldn't find exactly that. But you can check our full menu for some delicious options!";
    }
  }
}

// Instantiate global app controller
const app = new SmartCanteenApp();
