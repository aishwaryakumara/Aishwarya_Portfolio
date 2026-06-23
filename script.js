/* ════════════════════════════════════════
   Portfolio — Main Script
   ════════════════════════════════════════ */

/* ── Navbar ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Light / Dark theme toggle ── */
const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('theme') === 'light') {
  document.documentElement.classList.add('light');
}
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
});

/* ── Mobile menu ── */
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
  });
});

/* ── Typing animation ── */
const roles = [
  'Software Engineer',
  'Web App Developer',
  'Full Stack Engineer',
  'Product-minded Builder',
  'ML & AI Enthusiast',
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 50 : 85);
}
setTimeout(type, 800);

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Particle canvas ── */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const COLORS = ['rgba(59,130,246,', 'rgba(249,115,22,', 'rgba(20,184,166,'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.4 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.a = Math.random() * 0.45 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.col + this.a + ')';
    ctx.fill();
  }
}

for (let i = 0; i < 65; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(59,130,246,${0.06 * (1 - d / 110)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

let raf;
function animate() {
  ctx.clearRect(0, 0, W, H);
  drawLines();
  particles.forEach(p => { p.update(); p.draw(); });
  raf = requestAnimationFrame(animate);
}
animate();
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(raf); else animate();
});

/* ── Experience section: scroll-tracking ping dot ── */
const expPing = document.getElementById('expPing');
const expWrap = document.getElementById('expWrap');

if (expPing && expWrap) {
  function updatePing() {
    const rect = expWrap.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      expPing.classList.add('active');
      /* Clamp the ping within the section bounds */
      const centerY = window.innerHeight / 2;
      const sectionTop    = rect.top;
      const sectionBottom = rect.bottom;
      const absCenter = window.scrollY + centerY;
      const absSectionTop = window.scrollY + sectionTop;

      /* Pin ping between section top and bottom */
      const progress = (absCenter - absSectionTop) / expWrap.scrollHeight;
      const clampedY = Math.max(0, Math.min(expWrap.scrollHeight, absCenter - absSectionTop));
      expPing.style.top = `${Math.max(sectionTop + 14, Math.min(sectionBottom - 14, centerY))}px`;
    } else {
      expPing.classList.remove('active');
    }
  }
  window.addEventListener('scroll', updatePing, { passive: true });
  updatePing();
}

/* ── Education section: scroll-tracking ping dot ── */
const eduPing = document.getElementById('eduPing');
const eduWrap = document.getElementById('eduWrap');

if (eduPing && eduWrap) {
  function updateEduPing() {
    const rect = eduWrap.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      eduPing.classList.add('active');
      const centerY = window.innerHeight / 2;
      eduPing.style.top = `${Math.max(rect.top + 14, Math.min(rect.bottom - 14, centerY))}px`;
    } else {
      eduPing.classList.remove('active');
    }
  }
  window.addEventListener('scroll', updateEduPing, { passive: true });
  updateEduPing();
}

/* ── Resume FAB expand on hover ── */
const fab = document.getElementById('resumeFab');
if (fab) {
  fab.addEventListener('mouseenter', () => fab.classList.add('hovered'));
  fab.addEventListener('mouseleave', () => fab.classList.remove('hovered'));
}

/* ── Contact form ── */
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');
const submitBtn  = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitText.textContent = 'Sending...';
  submitBtn.disabled = true;

  /*
    To wire up real email delivery, replace this timeout with:
    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', e.target, 'YOUR_PUBLIC_KEY')
    (install emailjs-com and set up a template at emailjs.com)
  */
  setTimeout(() => {
    form.reset();
    submitText.textContent = 'Send Message';
    submitBtn.disabled = false;
    success.classList.add('visible');
    setTimeout(() => success.classList.remove('visible'), 5000);
  }, 1200);
});
