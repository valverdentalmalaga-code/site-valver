'use strict';

const toast = document.querySelector('.toast');
let toastTimer;
function notify(message) {
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toastTimer = setTimeout(() => { toast.textContent = ''; }, 4500);
}

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const code = button.dataset.copy;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code);
      notify(`${code} se copió al portapapeles.`);
    } catch {
      notify(`No pudimos copiarlo automáticamente. Código: ${code}`);
    }
  });
});

const navLinks = [...document.querySelectorAll('.sidebar nav a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
let scrollScheduled = false;
function updateNavigation() {
  const threshold = matchMedia('(max-width: 850px)').matches ? 185 : 130;
  let current = sections[0];
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= threshold) current = section;
  });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    current = sections.at(-1);
  }
  navLinks.forEach(link => {
    if (current && link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollScheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
window.addEventListener('hashchange', () => requestAnimationFrame(updateNavigation));
updateNavigation();

const dialog = document.querySelector('.demo-dialog');
const dialogHeading = dialog?.querySelector('#dialog-title');
const dialogCopy = dialog?.querySelector('p');
document.querySelectorAll('[data-demo]').forEach(button => {
  button.addEventListener('click', () => {
    if (!dialog) return;
    const label = button.textContent.trim().toLowerCase();
    const appointment = label.includes('cita') || label.includes('consulta');
    const care = label.includes('atención') || label.includes('cuidado');
    if (dialogHeading && dialogCopy) {
      dialogHeading.textContent = appointment
        ? 'Nos encantará conocerte.'
        : care
          ? 'Cada sonrisa tiene su historia.'
          : 'Un lugar para sentirte en confianza.';
      dialogCopy.textContent = appointment
        ? 'En la página final podrás elegir cómo ponerte en contacto con la clínica. Por ahora, este botón es una demostración: no se ha solicitado ninguna cita.'
        : care
          ? 'Queremos ayudarte a descubrir la atención que mejor se adapta a ti. Esta es una vista previa y aún no está conectada con los servicios de la clínica.'
          : 'Queremos que conozcas Valver con tranquilidad y a tu ritmo. Este botón forma parte de la demostración y todavía no abre una página de la clínica.';
    }
    dialog.showModal();
  });
});
dialog?.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

const form = document.querySelector('#demo-form');
const nameField = document.querySelector('#demo-name');
const nameHelp = document.querySelector('#name-help');
const formResult = document.querySelector('#form-result');
function resetField() {
  nameField.removeAttribute('aria-invalid');
  nameHelp.classList.remove('v-help--error');
  nameHelp.textContent = 'Escribe un nombre de ejemplo. No enviaremos ni guardaremos estos datos.';
  formResult.textContent = '';
}
nameField?.addEventListener('input', resetField);
form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!nameField.value.trim()) {
    nameField.setAttribute('aria-invalid', 'true');
    nameHelp.textContent = 'Escribe un nombre para continuar con el ejemplo.';
    nameHelp.classList.add('v-help--error');
    formResult.textContent = 'Revisa el campo marcado antes de continuar.';
    nameField.focus();
    return;
  }
  resetField();
  formResult.textContent = '¡Perfecto! La validación funciona. Recuerda que esta es una demostración y no se ha enviado ningún dato.';
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const activeAnimations = new Set();
const styles = getComputedStyle(document.documentElement);
const motionDefinitions = {
  reveal: { id: 'motion-reveal', frames: [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], duration: 480 },
  press: { id: 'motion-press', frames: [{ transform: 'scale(1)' }, { transform: `scale(${styles.getPropertyValue('--v-press-scale').trim()})` }, { transform: 'scale(1)' }], duration: 320 },
  feedback: { id: 'motion-feedback', frames: [{ backgroundColor: styles.getPropertyValue('--v-olive').trim() }, { backgroundColor: styles.getPropertyValue('--v-olive-dark').trim() }, { backgroundColor: styles.getPropertyValue('--v-olive').trim() }], duration: 320 }
};
document.querySelectorAll('[data-motion]').forEach(button => {
  button.addEventListener('click', () => {
    if (reducedMotion.matches) {
      notify('Movimiento reducido activado: la muestra permanece estática.');
      return;
    }
    const definition = motionDefinitions[button.dataset.motion];
    if (!definition) return;
    const target = document.getElementById(definition.id);
    if (!target) return;
    target.getAnimations().forEach(animation => animation.cancel());
    const animation = target.animate(definition.frames, {
      duration: definition.duration,
      easing: styles.getPropertyValue('--v-ease').trim()
    });
    activeAnimations.add(animation);
    animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
  });
});

// Entrada progresiva: si JavaScript está desactivado, nada queda oculto.
// Solo animamos elementos que todavía no están a la vista.
const revealElements = [...document.querySelectorAll(
  '.section-head, .hero-grid > *, .principle, .swatch, .font-card, .type-row, .panel, .v-card, .icon-item, .preview-shell, .implementation > *'
)];
let revealObserver;
function clearReveal() {
  revealObserver?.disconnect();
  revealElements.forEach(el => {
    el.classList.remove('v-scroll-enter');
    el.classList.remove('is-visible');
    el.style.removeProperty('--v-reveal-delay');
  });
}
function initReveal() {
  clearReveal();
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.06 });
  revealElements.forEach((el, index) => {
    if (el.getBoundingClientRect().top < innerHeight - 20) return;
    el.style.setProperty('--v-reveal-delay', `${(index % 3) * 65}ms`);
    el.classList.add('v-scroll-enter');
    revealObserver.observe(el);
  });
}
initReveal();

reducedMotion.addEventListener('change', event => {
  if (event.matches) {
    activeAnimations.forEach(animation => animation.cancel());
    clearReveal();
  } else {
    initReveal();
  }
});
