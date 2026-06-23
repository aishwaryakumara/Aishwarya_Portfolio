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
  'Software Developer',
  'Web Developer',
  'Full Stack Web Developer',
  'React & Next.js Developer',
  'Product-minded Builder',
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

/* ── Experience Modal ── */
const expData = {
  nbs: {
    period: 'Oct 2025 — Present', contract: 'Full-Time',
    title: 'Software Developer', company: 'National Benefit Services', loc: '📍 Denver, CO',
    bullets: [
      'Design, develop, and maintain a secure enterprise contract management web application for a third-party benefits administrator, delivering contract intake, review workflows, document tracking, and administrative reporting through interactive web interfaces.',
      'Build responsive, accessible (WCAG 2.2 AA) web interfaces using Next.js, React, Tailwind, and TypeScript; evaluate code to ensure proper structure, standards compliance, usability, and compatibility across browsers and devices.',
      'Implement web authentication and access-control flows using OAuth/OIDC (MSAL, Azure AD/B2C) for secure handling of sensitive participant data, incorporating privacy and accessibility considerations.',
      'Develop real-time web collaboration features using WebSocket and Yjs, and write supporting server-side code and RESTful APIs in Python and Flask for contract workflow automation, business logic, and data validation.',
      'Maintain the SQL databases and Microsoft Azure components that support the web system, and build front-end web tests with Playwright and Vitest to improve performance, scalability, reliability, and release quality.',
    ],
    tags: ['Next.js 15','React 19','TypeScript','Tailwind','Python','Flask','WebSocket/Yjs','OAuth/OIDC','Azure','Playwright','Vitest'],
  },
  hsye: {
    period: 'Jul 2023 — Sep 2025', contract: 'Full-Time',
    title: 'Research Assistant – Full Stack Web Developer', company: 'Healthcare Systems Engineering Institute (HSyE)', loc: '📍 Boston, MA',
    bullets: [
      'Designed and developed a full-stack healthcare web application using a Flask backend and React/JavaScript frontend to support hospital operations, epidemic surge planning, and real-time decision-support workflows.',
      'Developed and maintained the interactive web interfaces and RESTful APIs that support the web application, integrating DynamoDB for efficient data retrieval and scalable web workflows.',
      'Configured AWS infrastructure (Nginx, Gunicorn, CloudFront) and implemented GitHub Actions CI/CD pipelines to improve web application performance, reliability, and iterative releases within an Agile Scrum team.',
      'Developed web-based visualization and presentation features to communicate hospital resource-allocation outcomes to healthcare professionals during epidemic surge scenarios.',
    ],
    tags: ['React','Flask','JavaScript','AWS','DynamoDB','GitHub Actions','CI/CD','Agile/Scrum'],
  },
  mit: {
    period: 'Jun 2024 — Oct 2025', contract: 'Part-Time',
    title: 'Research Volunteer', company: 'MIT Sloan School of Management (CAMS)', loc: '📍 Cambridge, MA',
    bullets: [
      'Developed software tools and data-visualization workflows to model organizational cyber resilience, critical-infrastructure dependencies, and restoration strategies after disruption events, using Python, NetworkX, and Gurobi.',
    ],
    tags: ['Python','NetworkX','Gurobi','Data Visualization','Research'],
  },
  palladium: {
    period: 'Sep 2023 — Dec 2023', contract: 'Internship',
    title: 'Data Science Intern – AI / ML Applications', company: 'DataFI, The Palladium Group', loc: '📍 Washington, DC',
    bullets: [
      'Built a Whisper transcription pipeline for USAID healthcare projects, enabling automated transcription of multilingual audio recordings.',
      'Deployed RAG-based LLM solutions (GPT-4 + Mistral7B) for document summarization and semantic retrieval via AWS SageMaker.',
    ],
    tags: ['Python','Docker','OpenAI API','LLM / RAG','SageMaker','Whisper'],
  },
  accenture: {
    period: 'May 2018 — Feb 2021', contract: 'Full-Time',
    title: 'Software Engineer', company: 'Accenture PLC', loc: '📍 Mumbai, India',
    bullets: [
      'Developed enterprise software and backend solutions and collaborated with full-stack development teams to integrate backend pipelines with user-facing applications, improving usability and decision-support capabilities.',
      'Designed and deployed automation that improved team productivity by 150+ hours per month and contributed to client revenue recovery initiatives.',
      'Recognized with the APEX Excellence Award (Individual) for client impact and contract profitability.',
    ],
    tags: ['ASP.NET/C#','PySpark','SQL','MySQL','UNIX Shell Scripting'],
  },
  iitd: {
    period: 'Dec 2017 — May 2018', contract: 'Internship',
    title: 'Research Intern – NanoSensor Development', company: 'IIT Delhi', loc: '📍 Delhi, India',
    bullets: [
      'Created a LabVIEW-based interface to automate translation stage movement for nanosensor development.',
      'Integrated temperature control modules and tested sensor responsiveness under varying environmental conditions.',
    ],
    tags: ['C++','LabVIEW','Instrumentation'],
  },
  leeds: {
    period: 'Jul 2017 — Aug 2017', contract: 'Summer Program',
    title: 'Summer Program – Robotics & Sustainability', company: 'Leeds International Summer Program', loc: '📍 Leeds, UK',
    bullets: [
      'Built a line-following robot and a 3-DoF robotic arm from scratch using Python and hardware integration.',
      'Participated in interdisciplinary workshops on sustainability and energy systems.',
    ],
    tags: ['Python','Robotics','Team Collaboration'],
  },
};

const overlay = document.getElementById('expModalOverlay');
const modalClose = document.getElementById('expModalClose');

function openExpModal(id) {
  const d = expData[id]; if (!d) return;
  document.getElementById('modalPeriod').textContent   = d.period;
  document.getElementById('modalContract').textContent = d.contract;
  document.getElementById('modalTitle').textContent    = d.title;
  document.getElementById('modalCompany').textContent  = d.company;
  document.getElementById('modalLoc').textContent      = d.loc;
  document.getElementById('modalBullets').innerHTML    = d.bullets.map(b => `<li>${b}</li>`).join('');
  document.getElementById('modalTags').innerHTML       = d.tags.map(t => `<span>${t}</span>`).join('');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeExpModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.ec-card[data-exp], .research-card[data-exp]').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') return;
    openExpModal(card.dataset.exp);
  });
});

modalClose.addEventListener('click', closeExpModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeExpModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeExpModal(); });

/* ── Contact Form ── */
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
