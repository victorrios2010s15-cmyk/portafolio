// 1. SISTEMA DE PARTÍCULAS EN CANVAS (FONDO INTERACTIVO)
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-particulas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particulas = [];
    const numParticulas = Math.min(Math.floor(window.innerWidth / 20), 60);

    for (let i = 0; i < numParticulas; i++) {
        particulas.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 2 + 1
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';

        for (let i = 0; i < particulas.length; i++) {
            const p = particulas[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < particulas.length; j++) {
                const p2 = particulas[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(render);
    }
    render();
});

// 2. EFECTO TYPING (MÁQUINA DE ESCRITURA PARA ROL)
document.addEventListener('DOMContentLoaded', () => {
    const elementoTexto = document.getElementById('typing-text');
    if (!elementoTexto) return;

    const roles = ["Diseñador Creativo", "Desarrollador Front-End", "Entusiasta de la IA", "Estratega Web"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            elementoTexto.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            elementoTexto.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }
    typeEffect();
});

// 3. BARRA DE PROGRESO DE SCROLL E INDICADOR DE MENÚ ACTIVO
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const scrollBar = document.getElementById('scroll-bar');
    if (scrollBar) scrollBar.style.width = scrolled + '%';

    // Botón volver arriba
    const btnTop = document.getElementById('btn-top');
    if (btnTop) {
        if (winScroll > 400) btnTop.classList.add('visible');
        else btnTop.classList.remove('visible');
    }

    // ScrollSpy Nav Links
    const sections = document.querySelectorAll('header, section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (winScroll >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// 4. BOTÓN DE RETORNO ARRIBA
document.addEventListener('DOMContentLoaded', () => {
    const btnTop = document.getElementById('btn-top');
    if (btnTop) {
        btnTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// 5. EFECTO 3D TILT EN CARDS AL PASAR EL CURSOR
document.addEventListener('DOMContentLoaded', () => {
    const tiltElements = document.querySelectorAll('.js-tilt');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 16;
            const rotateY = (x / rect.width) * 16;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
});

// 6. SPOTLIGHT MOUSE EFFECT
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card, .project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

// 7. FORMULARIO DE CONTACTO
document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('formulario-contacto');
  const estadoFormulario = document.getElementById('estado-formulario');

  if (!formulario) return;

  formulario.addEventListener('submit', async function(evento) {
    evento.preventDefault();
    evento.stopPropagation();
    
    const nombre = formulario.querySelector('input[name="nombre"]').value.trim();
    const correo = formulario.querySelector('input[name="correo"]').value.trim();
    const mensaje = formulario.querySelector('textarea[name="mensaje"]').value.trim();

    estadoFormulario.style.display = "flex";
    estadoFormulario.className = "caja-estado caja-error";

    if (nombre === "" || correo === "" || mensaje === "") {
      estadoFormulario.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> TODOS LOS CAMPOS SON OBLIGATORIOS.';
      return;
    }

    const filtroNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,}(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,})+$/;
    if (!filtroNombre.test(nombre)) {
      estadoFormulario.innerHTML = '<i class="fa-solid fa-user-shield"></i> INGRESA NOMBRE Y APELLIDO REALES.';
      return;
    }

    const filtroCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!filtroCorreo.test(correo)) {
      estadoFormulario.innerHTML = '<i class="fa-solid fa-envelope-circle-check"></i> FORMATO DE CORREO INVÁLIDO.';
      return;
    }

    estadoFormulario.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ENVIANDO TRANSMISIÓN...';
    estadoFormulario.className = "caja-estado caja-exito";

    const datosFormulario = new FormData(formulario);

    try {
      const respuesta = await fetch(formulario.action, {
        method: formulario.method,
        body: datosFormulario,
        headers: { 'Accept': 'application/json' }
      });

      if (respuesta.ok) {
        estadoFormulario.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡MENSAJE TRANSMITIDO CON ÉXITO! TE RESPONDERÉ PRONTO.';
        estadoFormulario.className = "caja-estado caja-exito";
        formulario.reset();
      } else {
        throw new Error('Error de servidor');
      }
    } catch (error) {
      estadoFormulario.innerHTML = '<i class="fa-solid fa-wifi"></i> ERROR DE CONEXIÓN, INTENTA MÁS TARDE.';
      estadoFormulario.className = "caja-estado caja-error";
    }
  });
});

// 8. OBSERVADOR DE SECCIONES
document.addEventListener('DOMContentLoaded', () => {
    const secciones = document.querySelectorAll('section.about, section.skills, section.services, section.projects, section.contact');

    secciones.forEach(sec => sec.classList.add('seccion-oculta'));

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('seccion-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    secciones.forEach(sec => observer.observe(sec));
});

// 9. PRELOADER & REVELACIÓN HERO
window.addEventListener('load', () => {
    const preloader = document.getElementById('loader-pantalla');
    const heroSection = document.querySelector('header.hero');

    setTimeout(() => {
        if (preloader) preloader.classList.add('loader-oculto');
        if (heroSection) heroSection.classList.add('hero-activo');
    }, 2400);
});