/**
 * SEPEX-MG — Adesão ao Código de Conduta Ética e Conformidade
 * script.js — Lógica principal: partículas, interações, validação, envio
 *
 * ⚠️  SUBSTITUA A URL ABAIXO PELA URL DO SEU WEB APP DO GOOGLE APPS SCRIPT
 */
const GOOGLE_SCRIPT_URL = "COLE_AQUI_A_URL_DO_WEB_APP_DO_GOOGLE_APPS_SCRIPT";

/* ============================================================
   PARTÍCULAS
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const isMobile = () => window.innerWidth < 768;
  const COUNT = () => isMobile() ? 35 : 80;

  let W, H, particles = [];
  const BLUE = '13,110,255';
  const YELLOW = '255,233,0';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset = function() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.color = Math.random() > 0.85 ? YELLOW : BLUE;
      this.alpha = Math.random() * 0.5 + 0.1;
    };
    this.reset();
  }

  function build() {
    particles = [];
    const n = COUNT();
    for (let i = 0; i < n; i++) {
      particles.push(new Particle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const n = particles.length;
    for (let i = 0; i < n; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      // Linhas de conexão
      for (let j = i + 1; j < n; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${BLUE},${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  build();
  draw();
  window.addEventListener('resize', () => { resize(); build(); });
})();

/* ============================================================
   HEADER SCROLL
   ============================================================ */
(function initHeader() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

/* ============================================================
   PROGRESS BAR
   ============================================================ */
function updateProgressBar(pct) {
  document.getElementById('progress-bar').style.width = pct + '%';
}

/* ============================================================
   STEP DOTS
   ============================================================ */
const TOTAL_SECTIONS = 6;
function updateStepDots(filledSections) {
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.remove('done', 'active');
    if (i < filledSections - 1)  dot.classList.add('done');
    else if (i === filledSections - 1) dot.classList.add('active');
  });
}

/* ============================================================
   CARD GLOW SEGUINDO O MOUSE
   ============================================================ */
(function initCardGlow() {
  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  }, { passive: true });
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.05) + 's';
    observer.observe(card);
  });
})();

/* ============================================================
   PARALLAX LEVE NO HERO
   ============================================================ */
(function initParallax() {
  if (window.innerWidth < 768) return; // desativa no mobile
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (hero) hero.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
})();

/* ============================================================
   MÁSCARAS
   ============================================================ */
function maskCNPJ(v) {
  v = v.replace(/\D/g, '').substring(0, 14);
  if (v.length > 12) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  else if (v.length > 8) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4}?)/, '$1.$2.$3/$4');
  else if (v.length > 5) v = v.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
  else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
  return v;
}

function maskPhone(v) {
  v = v.replace(/\D/g, '').substring(0, 11);
  if (v.length > 10)   v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
  else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  return v;
}

document.getElementById('field-cnpj').addEventListener('input', function() {
  this.value = maskCNPJ(this.value);
});
document.getElementById('field-telefone').addEventListener('input', function() {
  this.value = maskPhone(this.value);
});

/* ============================================================
   VALIDAÇÃO DE E-MAIL
   ============================================================ */
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

/* ============================================================
   ESTADO VISUAL DOS INPUTS
   ============================================================ */
function setFieldState(input, state, msg) {
  const err = input.parentElement.querySelector('.field-error');
  input.classList.remove('valid', 'error');
  if (err) err.classList.remove('show');

  if (state === 'error') {
    input.classList.add('error');
    if (err && msg) { err.textContent = msg; err.classList.add('show'); }
  } else if (state === 'valid') {
    input.classList.add('valid');
  }
}

/* ============================================================
   OPTION CARD — PULSE AO SELECIONAR
   ============================================================ */
document.querySelectorAll('.option-card').forEach(card => {
  const radio = card.querySelector('input[type="radio"]');
  radio.addEventListener('change', () => {
    card.classList.remove('pulse');
    void card.offsetWidth; // reflow para re-trigger
    card.classList.add('pulse');
    setTimeout(() => card.classList.remove('pulse'), 350);
    updateProgress();
  });
});

/* ============================================================
   CALCULAR PROGRESSO
   ============================================================ */
function countFilledSections() {
  // Seção 1: verifica textos obrigatórios
  const s1 = ['field-empresa','field-cnpj','field-responsavel','field-cargo','field-email','field-telefone'];
  const s1ok = s1.every(id => document.getElementById(id)?.value.trim() !== '');

  // Seções 2-6: verifica rádios obrigatórios
  function radioOk(name) {
    return !!document.querySelector(`input[name="${name}"]:checked`);
  }
  const s2ok = radioOk('carencia60dias')    && radioOk('naoInterfere');
  const s3ok = radioOk('compliance')        && radioOk('anticorrupcao');
  const s4ok = radioOk('manutencao')        && radioOk('descarte');
  const s5ok = radioOk('lgpdColeta')        && radioOk('dpo');
  const s6ok = radioOk('declaracao');

  return [s1ok,s2ok,s3ok,s4ok,s5ok,s6ok].filter(Boolean).length;
}

function updateProgress() {
  const filled = countFilledSections();
  const pct = Math.round((filled / TOTAL_SECTIONS) * 100);
  updateProgressBar(pct);
  updateStepDots(filled);
}

// Observa mudanças nos inputs de texto
document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(el => {
  el.addEventListener('input', updateProgress);
});

/* ============================================================
   VALIDAÇÃO COMPLETA DO FORMULÁRIO
   ============================================================ */
function validateAll() {
  let valid = true;
  let firstError = null;

  // Textos obrigatórios
  const textFields = [
    { id: 'field-empresa',    msg: 'Informe o nome da empresa.' },
    { id: 'field-cnpj',      msg: 'Informe o CNPJ.' },
    { id: 'field-responsavel',msg: 'Informe o nome do responsável.' },
    { id: 'field-cargo',     msg: 'Informe o cargo/função.' },
    { id: 'field-email',     msg: 'Informe o e-mail corporativo.' },
    { id: 'field-telefone',  msg: 'Informe o telefone.' },
  ];

  textFields.forEach(({ id, msg }) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      setFieldState(el, 'error', msg);
      if (!firstError) firstError = el;
      valid = false;
    } else {
      setFieldState(el, 'valid');
    }
  });

  // E-mail
  const emailEl = document.getElementById('field-email');
  if (emailEl.value.trim() && !isValidEmail(emailEl.value.trim())) {
    setFieldState(emailEl, 'error', 'E-mail inválido.');
    if (!firstError) firstError = emailEl;
    valid = false;
  }

  // Rádios obrigatórios
  const radioGroups = [
    { name: 'carencia60dias',  msg: 'Selecione uma opção.' },
    { name: 'naoInterfere',   msg: 'Selecione uma opção.' },
    { name: 'compliance',     msg: 'Selecione uma opção.' },
    { name: 'anticorrupcao',  msg: 'Selecione uma opção.' },
    { name: 'manutencao',     msg: 'Selecione uma opção.' },
    { name: 'descarte',       msg: 'Selecione uma opção.' },
    { name: 'lgpdColeta',     msg: 'Selecione uma opção.' },
    { name: 'dpo',            msg: 'Selecione uma opção.' },
    { name: 'declaracao',     msg: 'Selecione uma opção.' },
  ];

  radioGroups.forEach(({ name, msg }) => {
    const group = document.querySelector(`[data-group="${name}"]`);
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    if (!checked) {
      if (group) {
        group.classList.add('error-group');
        const err = group.querySelector('.field-error');
        if (err) { err.textContent = msg; err.classList.add('show'); }
      }
      if (!firstError && group) firstError = group;
      valid = false;
    } else {
      if (group) {
        group.classList.remove('error-group');
        const err = group.querySelector('.field-error');
        if (err) err.classList.remove('show');
      }
    }
  });

  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}

/* ============================================================
   COLETA DOS DADOS DO FORMULÁRIO
   ============================================================ */
function collectData() {
  const g = (id) => document.getElementById(id)?.value.trim() ?? '';
  const r = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value ?? '';

  return {
    empresa:        g('field-empresa'),
    cnpj:           g('field-cnpj'),
    responsavel:    g('field-responsavel'),
    cargo:          g('field-cargo'),
    email:          g('field-email'),
    telefone:       g('field-telefone'),
    carencia60dias: r('carencia60dias'),
    naoInterfere:   r('naoInterfere'),
    compliance:     r('compliance'),
    anticorrupcao:  r('anticorrupcao'),
    manutencao:     r('manutencao'),
    descarte:       r('descarte'),
    lgpdColeta:     r('lgpdColeta'),
    dpo:            r('dpo'),
    declaracao:     r('declaracao'),
    duvidas:        g('field-duvidas'),
    userAgent:      navigator.userAgent,
    origemPagina:   window.location.href,
  };
}

/* ============================================================
   ENVIO
   ============================================================ */
let isSubmitting = false;

document.getElementById('form-submit-btn').addEventListener('click', async function() {
  if (isSubmitting) return;

  // Esconde erro anterior
  document.getElementById('send-error-banner').classList.remove('show');

  if (!validateAll()) return;

  isSubmitting = true;
  this.classList.add('is-loading');
  this.disabled = true;

  const data = collectData();

  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors', // Apps Script exige no-cors para evitar CORS errors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Com no-cors não podemos ler a resposta, então assumimos sucesso se não lançou exceção
    showSuccess();

  } catch (err) {
    console.error('Erro no envio:', err);
    document.getElementById('send-error-banner').classList.add('show');
    isSubmitting = false;
    this.classList.remove('is-loading');
    this.disabled = false;
  }
});

function showSuccess() {
  document.getElementById('form-area').style.display = 'none';
  const s = document.getElementById('success-screen');
  s.classList.add('show');
  updateProgressBar(100);
  s.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   SCROLL SUAVE DO BOTÃO HERO
   ============================================================ */
document.getElementById('btn-start').addEventListener('click', () => {
  document.getElementById('form-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ============================================================
   PROGRESS INICIAL
   ============================================================ */
updateProgress();

/* ============================================================
   HOVER NOS INPUTS — válida inline ao sair
   ============================================================ */
document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(el => {
  el.addEventListener('blur', function() {
    if (this.value.trim()) {
      if (this.id === 'field-email' && !isValidEmail(this.value.trim())) {
        setFieldState(this, 'error', 'E-mail inválido.');
      } else {
        setFieldState(this, 'valid');
      }
    }
  });
});

/* ============================================================
   ELEMENTOS GEOMÉTRICOS FLUTUANTES (HERO)
   ============================================================ */
(function initGeoShapes() {
  const container = document.querySelector('.geo-shapes');
  if (!container) return;

  const shapes = [
    { w: 40, h: 40, top: '15%', left: '8%',  dur: 9,  del: 0 },
    { w: 20, h: 20, top: '70%', left: '5%',  dur: 12, del: 1 },
    { w: 55, h: 55, top: '25%', right: '6%', dur: 7,  del: 2 },
    { w: 25, h: 25, top: '60%', right: '10%',dur: 10, del: 0.5 },
    { w: 14, h: 14, top: '45%', left: '15%', dur: 8,  del: 1.5 },
    { w: 30, h: 30, top: '80%', right: '18%',dur: 11, del: 3 },
  ];

  shapes.forEach(s => {
    const el = document.createElement('div');
    el.className = 'geo';
    el.style.cssText = `
      width:${s.w}px;height:${s.h}px;
      top:${s.top};${s.left ? 'left:'+s.left : 'right:'+s.right};
      --dur:${s.dur}s;--del:${s.del}s;
    `;
    container.appendChild(el);
  });
})();
