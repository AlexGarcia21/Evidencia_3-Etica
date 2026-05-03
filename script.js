/* ═══════════════════════════════════════════════
   BLOG ACADÉMICO · ÉTICA Y CIUDADANÍA
   JavaScript — Interactividad Completa
═══════════════════════════════════════════════ */

'use strict';

/* ── Corrección de respuestas del Quiz ── */
const CORRECT_ANSWERS = {
  q1: 'b', // Utilitarismo
  q2: 'c', // John Rawls
  q3: 'b', // 2030
};

const RESULT_MESSAGES = {
  0: { emoji: '📚', msg: 'Sigue estudiando. La ética es un camino de reflexión continua.' },
  1: { emoji: '🤔', msg: 'Buen inicio. Cada pregunta es una invitación a profundizar.' },
  2: { emoji: '⚡', msg: '¡Muy bien! Tienes una base sólida en ética contemporánea.' },
  3: { emoji: '🏆', msg: '¡Perfecto! Dominas los fundamentos éticos con excelencia.' },
};

/* ═══════════════════════════════════════
   1. SISTEMA DE TEMAS DE COLOR
═══════════════════════════════════════ */
function initThemeSystem() {
  const navBtns = document.querySelectorAll('.nav-btn');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      const target = btn.dataset.target;

      // Actualizar botón activo
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Cambiar tema de color en el body
      applyTheme(theme);

      // Scroll suave a la sección
      if (target) {
        const section = document.getElementById(target);
        if (section) {
          const navHeight = document.getElementById('mainNav').offsetHeight;
          const top = section.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
}

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
}

/* ═══════════════════════════════════════
   2. ACTUALIZACIÓN DE TEMA SEGÚN SCROLL
   (Detecta en qué sección estás)
═══════════════════════════════════════ */
function initScrollSpy() {
  const sections = [
    { id: 'digital',     theme: 'blue'    },
    { id: 'social',      theme: 'coral'   },
    { id: 'profesional', theme: 'emerald' },
    { id: 'corrupcion',  theme: 'amber'   },
    { id: 'ods',         theme: 'purple'  },
  ];

  const navBtns = document.querySelectorAll('.nav-btn');
  const navHeight = document.getElementById('mainNav').offsetHeight;

  let ticking = false;

  function updateActiveSection() {
    const scrollY = window.scrollY + navHeight + 60;

    let current = null;
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) {
        current = id;
      }
    });

    if (current) {
      const match = sections.find(s => s.id === current);
      if (match) {
        // Actualizar tema de color
        document.body.setAttribute('data-theme', match.theme);

        // Actualizar botón activo en la nav
        navBtns.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.target === current);
        });
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateActiveSection);
      ticking = true;
    }
  });
}


/* ═══════════════════════════════════════
   3. BOTONES "VER EJEMPLO DE APLICACIÓN"
═══════════════════════════════════════ */
function initRevealButtons() {
  const revealBtns = document.querySelectorAll('.reveal-btn');

  revealBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const content = document.getElementById(targetId);
      if (!content) return;

      const isOpen = content.classList.contains('visible');

      if (isOpen) {
        content.classList.remove('visible');
        btn.classList.remove('open');
        btn.textContent = 'Ver Ejemplo de Aplicación';
        btn.insertAdjacentHTML('afterbegin', '');
      } else {
        content.classList.add('visible');
        btn.classList.add('open');
        btn.textContent = 'Ocultar Ejemplo';
      }
    });
  });
}


/* ═══════════════════════════════════════
   4. QUIZ INTERACTIVO
═══════════════════════════════════════ */
function initQuiz() {
  const submitBtn = document.getElementById('quizSubmit');
  const resultDiv = document.getElementById('quizResult');

  if (!submitBtn) return;

  submitBtn.addEventListener('click', evaluateQuiz);

  function evaluateQuiz() {
    let score = 0;
    let allAnswered = true;

    // Verificar que todas estén respondidas
    Object.keys(CORRECT_ANSWERS).forEach(q => {
      const selected = document.querySelector(`input[name="${q}"]:checked`);
      if (!selected) allAnswered = false;
    });

    if (!allAnswered) {
      showNotification('Por favor, responde todas las preguntas antes de verificar.');
      shakeContainer();
      return;
    }

    // Evaluar cada pregunta
    Object.entries(CORRECT_ANSWERS).forEach(([q, correct]) => {
      const selected = document.querySelector(`input[name="${q}"]:checked`);
      const allOptions = document.querySelectorAll(`input[name="${q}"]`);
      const questionEl = document.getElementById(q);

      allOptions.forEach(opt => {
        const label = opt.closest('.quiz-option');
        // Deshabilitar opciones
        opt.disabled = true;

        if (opt.value === correct) {
          label.classList.add(selected.value === correct ? 'correct' : 'show-answer');
        }

        if (opt.checked && opt.value !== correct) {
          label.classList.add('incorrect');
        }
      });

      if (selected && selected.value === correct) score++;
    });

    // Deshabilitar botón
    submitBtn.disabled = true;
    submitBtn.textContent = '✓ Quiz completado';

    // Mostrar resultado
    showResult(score);
  }
}

function showResult(score) {
  const resultDiv = document.getElementById('quizResult');
  const { emoji, msg } = RESULT_MESSAGES[score];

  resultDiv.innerHTML = `
    <span class="result-score">${emoji} ${score} / 3</span>
    <p class="result-msg">${msg}</p>
    <button class="reveal-btn" style="margin-top:18px; display:inline-flex;" onclick="resetQuiz()">
      Intentar de nuevo
    </button>
  `;

  resultDiv.classList.add('show');

  // Scroll suave al resultado
  setTimeout(() => {
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300);
}

function resetQuiz() {
  const submitBtn = document.getElementById('quizSubmit');
  const resultDiv = document.getElementById('quizResult');

  // Limpiar todas las opciones seleccionadas
  document.querySelectorAll('.quiz-option').forEach(label => {
    label.classList.remove('correct', 'incorrect', 'show-answer');
  });

  document.querySelectorAll('.quiz-options input[type="radio"]').forEach(input => {
    input.checked = false;
    input.disabled = false;
  });

  // Resetear botón
  submitBtn.disabled = false;
  submitBtn.textContent = 'Verificar Respuestas';

  // Ocultar resultado
  resultDiv.classList.remove('show');
  resultDiv.innerHTML = '';

  // Scroll al quiz
  document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
}

// Exponer globalmente para el onclick del botón
window.resetQuiz = resetQuiz;


/* ═══════════════════════════════════════
   5. UTILIDADES
═══════════════════════════════════════ */
function showNotification(msg) {
  // Eliminar notificación previa
  const prev = document.querySelector('.toast-notification');
  if (prev) prev.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = msg;

  // Estilos inline para el toast
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: 'rgba(20,22,35,0.95)',
    border: '1px solid var(--accent-border)',
    color: 'var(--text-primary)',
    padding: '14px 24px',
    borderRadius: '12px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    zIndex: '9999',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    opacity: '0',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    pointerEvents: 'none',
  });

  document.body.appendChild(toast);

  // Animar entrada
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  // Remover después de 3s
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function shakeContainer() {
  const container = document.getElementById('quizContainer');
  container.style.animation = 'none';
  container.offsetHeight; // reflow
  container.style.animation = 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both';

  // Inyectar animación shake si no existe
  if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      @keyframes shake {
        10%, 90% { transform: translateX(-3px); }
        20%, 80% { transform: translateX(5px); }
        30%, 50%, 70% { transform: translateX(-6px); }
        40%, 60% { transform: translateX(6px); }
        100% { transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
  }
}


/* ═══════════════════════════════════════
   6. INTERSECTION OBSERVER (Animaciones)
═══════════════════════════════════════ */
function initIntersectionObserver() {
  const cards = document.querySelectorAll('.card, .quiz-question');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.06}s, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.06}s, border-color 0.35s ease, box-shadow 0.35s ease`;
    observer.observe(card);
  });
}


/* ═══════════════════════════════════════
   7. FOOTER: AÑO DINÁMICO
═══════════════════════════════════════ */
function setFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}


/* ═══════════════════════════════════════
   8. INICIALIZACIÓN GENERAL
═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme('blue'); // Tema inicial

  initThemeSystem();
  initScrollSpy();
  initRevealButtons();
  initQuiz();
  initIntersectionObserver();
  setFooterYear();

  console.log(
    '%c🎓 Blog · Ética y Ciudadanía %c Iniciado correctamente',
    'background:#1a1d2e; color:#6ea8fe; padding:6px 12px; border-radius:4px 0 0 4px; font-weight:bold;',
    'background:#0d1117; color:#8b949e; padding:6px 12px; border-radius:0 4px 4px 0;'
  );
});