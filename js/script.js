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

  /* ---- Carrusel del personal encargado ---- */
  const personalCarousel = document.querySelector('.personal-carousel');
  if (personalCarousel) {
    const track = personalCarousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevBtn = personalCarousel.querySelector('.carousel-btn.prev');
    const nextBtn = personalCarousel.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentSlide = 0;

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      const dots = dotsContainer?.querySelectorAll('button') || [];
      dots.forEach((dot, index) => {
        dot.classList.toggle('is-active', index === currentSlide);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ver slide ${index + 1}`);
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
      });
      dotsContainer?.appendChild(dot);
    });

    prevBtn?.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    nextBtn?.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel();
    });

    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel();
    }, 7000);

    personalCarousel.querySelectorAll('input[type="file"]').forEach(input => {
      input.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const preview = input.closest('.slide-media').querySelector('.slide-photo');
          const caption = input.closest('.slide-media').querySelector('.slide-photo-caption');
          if (preview) {
            preview.src = reader.result;
            preview.classList.add('has-image');
          }
          if (caption) caption.textContent = 'Foto cargada';
        };
        reader.readAsDataURL(file);
      });
    });

    updateCarousel();
  }

  /* ---- Vista previa emergente de las evidencias ---- */
  const evidenceCards = document.querySelectorAll('.evidencia-card.evidencia-con-imagen');
  if (evidenceCards.length) {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'evidencia-popup-overlay';
    popupOverlay.setAttribute('role', 'dialog');
    popupOverlay.setAttribute('aria-modal', 'true');
    popupOverlay.setAttribute('aria-label', 'Vista previa de imagen');

    const popupContent = document.createElement('div');
    popupContent.className = 'evidencia-popup-content';

    const popupImage = document.createElement('img');
    popupImage.className = 'evidencia-popup-image';

    const popupCaption = document.createElement('p');
    popupCaption.className = 'evidencia-popup-caption';

    popupContent.appendChild(popupImage);
    popupContent.appendChild(popupCaption);
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);

    let popupTimer;

    const showPopup = (src, alt, label) => {
      popupImage.src = src;
      popupImage.alt = alt;
      popupCaption.textContent = label;
      popupOverlay.classList.add('active');
      clearTimeout(popupTimer);
      popupTimer = setTimeout(() => {
        popupOverlay.classList.remove('active');
      }, 3000);
    };

    evidenceCards.forEach(card => {
      card.addEventListener('click', () => {
        const image = card.querySelector('img');
        const label = card.querySelector('.evidencia-label')?.textContent?.trim() || image?.alt || 'Vista previa';
        if (image) {
          showPopup(image.src, image.alt, label);
        }
      });
    });

    
    popupOverlay.addEventListener('click', (event) => {
      if (event.target === popupOverlay) {
        popupOverlay.classList.remove('active');
        clearTimeout(popupTimer);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        popupOverlay.classList.remove('active');
        clearTimeout(popupTimer);
      }
    });
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