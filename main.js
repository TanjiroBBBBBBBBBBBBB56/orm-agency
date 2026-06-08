// ── GOOGLE SHEETS ENDPOINT ──
// Replace this URL with your deployed Apps Script Web App URL
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzwN-z9vyJAiVzP8IFqhTKjSmlKbpYUIc45IDuetmx0BUrroDzoPhN2AQcm-pOCCaqYWw/exec';

// ── NAVBAR SCROLL ──
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ── MOBILE MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── SCROLL ANIMATIONS ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── SCORE BAR ANIMATION ──
const scoreObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.score-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width || '0%';
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.reputation-card').forEach(el => scoreObserver.observe(el));

// ── ORDER MODAL ──
const modalOverlay = document.getElementById('modalOverlay');
const orderForm = document.getElementById('orderForm');
const formSuccess = document.getElementById('formSuccess');

function openModal(pkg = '') {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (pkg) {
    const select = document.getElementById('packageSelect');
    if (select) {
      for (let opt of select.options) {
        if (opt.value === pkg) { select.value = pkg; break; }
      }
    }
  }
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    orderForm.style.display = 'block';
    formSuccess.style.display = 'none';
    orderForm.reset();
  }, 300);
}

document.querySelectorAll('[data-order]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.order));
});

document.getElementById('modalClose')?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── FORM SUBMISSION ──
orderForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = orderForm.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const data = {
    name: document.getElementById('clientName').value,
    email: document.getElementById('clientEmail').value,
    brand: document.getElementById('brandName').value,
    website: document.getElementById('brandWebsite').value,
    package: document.getElementById('packageSelect').value,
    contact: document.getElementById('contactPref').value,
    message: document.getElementById('message').value,
    timestamp: new Date().toISOString(),
  };

  try {
    if (SHEET_ENDPOINT !== 'YOUR_APPS_SCRIPT_URL_HERE') {
      await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
    orderForm.style.display = 'none';
    formSuccess.style.display = 'block';
  } catch (err) {
    showToast('Something went wrong. Please contact us directly.');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// ── TOAST NOTIFICATION ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── SMOOTH ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--purple)' : '';
  });
});

// ── ANIMATE SCORE BARS ON LOAD ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.score-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width || '0%';
    });
  }, 800);
});
