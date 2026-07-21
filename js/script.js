/* =========================================================
   JNN — Jesusinos News Network
   Interacción del sitio
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Año dinámico en el footer ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Menú móvil ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Cierra el menú al elegir una opción (en móvil)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Resaltar el enlace de la sección visible ---- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.style.opacity = a.getAttribute('href') === `#${id}` ? '1' : '';
          });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  /* ---- Botón "volver arriba" ---- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
  }

  /* ---- Revelado suave de secciones al hacer scroll ---- */
  const revealTargets = document.querySelectorAll('.section');
  if ('IntersectionObserver' in window && revealTargets.length) {
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(el => revealObserver.observe(el));
  }

  /* ---- Validación y envío del formulario de contacto ---- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.textContent = '';
      status.classList.remove('error');

      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        const wrapper = field.closest('.form-field');
        let fieldValid = true;

        if (field.type === 'checkbox') {
          fieldValid = field.checked;
        } else if (field.type === 'email') {
          fieldValid = field.value.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        } else {
          fieldValid = field.value.trim() !== '';
        }

        if (wrapper) wrapper.classList.toggle('invalid', !fieldValid);
        if (!fieldValid) isValid = false;
      });

      if (!isValid) {
        status.textContent = 'Revisa los campos marcados en rojo antes de enviar.';
        status.classList.add('error');
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // No hay backend conectado: se simula el envío exitoso.
      // Para conectar un servicio real (Formspree, EmailJS, etc.)
      // reemplaza este bloque por la llamada correspondiente.
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-dot"></span>Enviando…';

      setTimeout(() => {
        status.textContent = '¡Gracias! Tu mensaje fue registrado. El equipo de JNN te responderá pronto.';
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 900);
    });

    // Quita el estado de error apenas el usuario corrige el campo
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        const wrapper = field.closest('.form-field');
        if (wrapper) wrapper.classList.remove('invalid');
      });
    });
  }

});