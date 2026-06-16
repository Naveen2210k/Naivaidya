// ========================
// NAIVAIDYA App – JavaScript
// Navigation, Interactions, Animations
// ========================

// Screen map
const screens = {
  splash: 'screen-splash',
  home: 'screen-home',
  medicine: 'screen-medicine',
  lab: 'screen-lab',
  doctor: 'screen-doctor',
  sos: 'screen-sos',
  aichat: 'screen-aichat',
  orders: 'screen-orders',
  profile: 'screen-profile',
};

let currentScreen = 'splash';

// Navigate between screens
function navigate(screenName) {
  const prev = document.getElementById(screens[currentScreen]);
  const next = document.getElementById(screens[screenName]);
  if (!next || screenName === currentScreen) return;

  // Deactivate current
  if (prev) {
    prev.classList.remove('active');
  }

  // Activate new
  next.classList.add('active');

  // Scroll back to top
  const scroll = next.querySelector('.screen-scroll, .sos-screen-bg, .chat-messages');
  if (scroll) scroll.scrollTop = 0;

  currentScreen = screenName;
  updateNavBar(screenName);
}

// Update bottom nav active state
function updateNavBar(screenName) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  const navMap = {
    home: 0,
    medicine: 1,
    lab: 2,
    orders: 3,
    profile: 4,
    doctor: 1,
  };

  const screenEl = document.getElementById(screens[screenName]);
  if (!screenEl) return;
  const navEl = screenEl.querySelector('.bottom-nav');
  if (!navEl) return;
  const items = navEl.querySelectorAll('.nav-item');
  const idx = navMap[screenName];
  if (idx !== undefined && items[idx]) {
    items[idx].classList.add('active');
  }
}

// Category chip toggle
document.querySelectorAll('.cat-chip').forEach(chip => {
  chip.addEventListener('click', function () {
    document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
    this.classList.add('active');
  });
});

// Speciality card toggle
document.querySelectorAll('.spec-card').forEach(card => {
  card.addEventListener('click', function () {
    document.querySelectorAll('.spec-card').forEach(c => c.classList.remove('spec-active'));
    this.classList.add('spec-active');
  });
});

// Slot button toggle
document.querySelectorAll('.slot-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// Order tabs
document.querySelectorAll('.order-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.order-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// Add to cart button animation
document.querySelectorAll('.med-add-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    this.textContent = '✓';
    this.style.background = '#10B981';
    showToast('Added to cart! 🛒');
    setTimeout(() => {
      this.textContent = '+';
      this.style.background = '';
    }, 1500);
  });
});

// Search bar focus animation
function focusSearch() {
  showToast('Search opened 🔍');
}

// Notification button
function showNotification() {
  showToast('3 new notifications 🔔');
}

// Booking modal
function showBookingModal() {
  const modal = document.getElementById('bookingModal');
  modal.classList.add('active');
}

function closeModal(event) {
  const modal = document.getElementById('bookingModal');
  if (!event || event.target === modal) {
    modal.classList.remove('active');
  }
}

function confirmBooking() {
  closeModal();
  showToast('✅ Booking confirmed! Check Orders.');
  setTimeout(() => navigate('orders'), 1500);
}

// SOS actions
function sosCall() {
  showToast('🚑 Calling Ambulance... 108');
  // Pulse animation
  const btn = document.querySelector('.sos-center-btn');
  btn.style.transform = 'scale(0.9)';
  setTimeout(() => btn.style.transform = '', 300);
}

function sosShare() {
  showToast('📍 Location shared with emergency contacts!');
}

function sosHospital() {
  showToast('🏥 Contacting nearest hospital...');
}

// AI Chat – Send Message
function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  const chatMessages = document.getElementById('chatMessages');

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-msg user';
  userMsg.innerHTML = `<div class="chat-bubble user-bubble-style">${escapeHtml(msg)}</div>`;
  chatMessages.appendChild(userMsg);
  input.value = '';

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // AI response after delay
  setTimeout(() => {
    const response = getAIResponse(msg.toLowerCase());
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = `
      <div class="chat-avatar-small">🤖</div>
      <div class="chat-bubble bot-bubble-style">${response}</div>
    `;
    chatMessages.appendChild(botMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 800);
}

// Simple AI response logic
function getAIResponse(msg) {
  if (msg.includes('fever') || msg.includes('temperature')) {
    return '🌡️ For fever: Stay hydrated, rest well, and take Paracetamol 500mg if temp > 101°F. Shall I connect you with a doctor?';
  } else if (msg.includes('headache') || msg.includes('head')) {
    return '💆 For headaches: Try resting in a dark room. A cold compress can help. If severe or persistent, please consult a doctor.';
  } else if (msg.includes('diabetes') || msg.includes('sugar')) {
    return '🍬 Managing diabetes: Monitor blood sugar regularly, follow a balanced diet, and take medications as prescribed. Would you like to book a diabetes profile test?';
  } else if (msg.includes('medicine') || msg.includes('remind')) {
    return '⏰ I\'ll set up medicine reminders for you! Please tell me the medicine name and timing.';
  } else if (msg.includes('appointment') || msg.includes('doctor')) {
    return '👨‍⚕️ I can help you book a doctor! We have General Physicians available in just 2 minutes. Shall I connect you?';
  } else if (msg.includes('lab') || msg.includes('test') || msg.includes('blood')) {
    return '🧪 I can help you book a lab test! We offer home sample collection. Popular tests: Blood Test ₹299, CBC ₹199, Diabetes Profile ₹249.';
  } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return '👋 Hello! I\'m Vaidy, your AI health assistant. You can ask me about symptoms, medicines, lab tests, or book a doctor!';
  } else if (msg.includes('pregnant') || msg.includes('pregnancy')) {
    return '🤱 Congratulations! I can help with pregnancy care – nutrition tips, doctor consultations with Gynecologists, and prenatal lab tests.';
  } else if (msg.includes('mental') || msg.includes('anxiety') || msg.includes('stress')) {
    return '🧘 Mental health matters! Deep breathing, regular exercise, and talking to someone can help. I can connect you with a Psychiatrist if needed.';
  } else {
    return '🤔 I understand. Can you tell me more about your symptoms? I\'m here to help you get the right care quickly.';
  }
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

// Allow Enter key to send message
document.getElementById('chatInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendMessage();
});

// Toast notification
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Splash screen animation + auto-redirect
function initSplash() {
  const splash = document.getElementById('screen-splash');
  splash.classList.add('active');

  // Auto navigate to home after 3s
  setTimeout(() => {
    navigate('home');
  }, 3000);
}

// Add to cart with ripple effect
function addRipple(e, el) {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.4);
    width: 100px; height: 100px;
    left: ${e.clientX - el.getBoundingClientRect().left - 50}px;
    top: ${e.clientY - el.getBoundingClientRect().top - 50}px;
    transform: scale(0);
    animation: rippleEffect 0.5s ease-out;
    pointer-events: none;
  `;
  el.style.position = 'relative';
  el.style.overflow = 'hidden';
  el.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
}

// Add ripple style
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleEffect {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Apply ripple to buttons
document.querySelectorAll('.service-card, .sos-btn, .promo-btn, .lb-btn, .dpc-btn, .llc-btn').forEach(el => {
  el.addEventListener('click', function (e) {
    addRipple(e, this);
  });
});

// Profile menu item animations
document.querySelectorAll('.pm-item').forEach(item => {
  item.addEventListener('click', function () {
    const label = this.querySelector('.pm-label').textContent;
    showToast(`Opening ${label}...`);
  });
});

// Hospital call buttons
document.querySelectorAll('.hosp-call-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const name = this.closest('.hospital-card').querySelector('.hosp-name').textContent;
    showToast(`📞 Calling ${name}...`);
  });
});

// Emergency contact call buttons
document.querySelectorAll('.ec-call').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const name = this.closest('.ec-card').querySelector('.ec-name').textContent;
    showToast(`📞 Calling ${name}...`);
  });
});

// Quick action buttons in chat
document.querySelectorAll('.cqa-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const text = this.textContent.trim();
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
      chatInput.value = text;
      sendMessage();
    }
  });
});

// Smooth scroll behavior
document.querySelectorAll('.screen-scroll').forEach(el => {
  el.style.scrollBehavior = 'smooth';
});

// Medicine card hover effect
document.querySelectorAll('.med-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
  });
  card.addEventListener('mouseleave', function () {
    this.style.transform = '';
    this.style.boxShadow = '';
  });
});

// Doctor cards hover
document.querySelectorAll('.doctor-profile-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)';
  });
  card.addEventListener('mouseleave', function () {
    this.style.transform = '';
    this.style.boxShadow = '';
  });
});

// Lab list cards hover
document.querySelectorAll('.lab-list-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.borderColor = 'var(--teal)';
  });
  card.addEventListener('mouseleave', function () {
    this.style.borderColor = '';
  });
});

// Initialize App
document.addEventListener('DOMContentLoaded', function () {
  initSplash();

  // Check for scrollable content indicators
  document.querySelectorAll('.h-scroll').forEach(el => {
    if (el.scrollWidth > el.clientWidth) {
      el.style.paddingRight = '16px';
    }
  });
});
