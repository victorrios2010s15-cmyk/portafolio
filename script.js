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
      estadoFormulario.innerHTML = '<i class="fa-solid fa-triangle-exclamation icono-estado"></i> TERMINAL: TODOS LOS CAMPOS SON OBLIGATORIOS.';
      return;
    }

    const filtroNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,}(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,})+$/;
    if (!filtroNombre.test(nombre)) {
      estadoFormulario.innerHTML = '<i class="fa-solid fa-user-shield icono-estado"></i> ERROR SEGURIDAD: INGRESA NOMBRE Y APELLIDO REALES.';
      return;
    }

    const patronRepetido = /(.)\1{3,}/;
    if (patronRepetido.test(nombre) || patronRepetido.test(mensaje)) {
      estadoFormulario.innerHTML = '<i class="fa-solid fa-bug icono-estado"></i> ERROR DE ENTRADA: DETECTADO TEXTO BASURA O REPETITIVO.';
      return;
    }

    const filtroCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!filtroCorreo.test(correo)) {
      estadoFormulario.innerHTML = '<i class="fa-solid fa-envelope-circle-check icono-estado"></i> ERROR: FORMATO DE CORREO INVÁLIDO.';
      return;
    }

    estadoFormulario.innerHTML = '<i class="fa-solid fa-spinner fa-spin icono-estado"></i> CONECTANDO CON EL SERVIDOR DE SEGURIDAD...';
    estadoFormulario.className = "caja-estado caja-exito";

    const datosFormulario = new FormData(formulario);

    try {
      const respuesta = await fetch(formulario.action, {
        method: formulario.method,
        body: datosFormulario,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (respuesta.ok) {
        estadoFormulario.innerHTML = '<i class="fa-solid fa-circle-check icono-estado"></i> ¡MENSAJE TRANSMITIDO CON ÉXITO! TE RESPONDERÉ PRONTO.';
        estadoFormulario.className = "caja-estado caja-exito";
        formulario.reset();
      } else {
        throw new Error('Error de servidor');
      }
    } catch (error) {
      estadoFormulario.innerHTML = '<i class="fa-solid fa-wifi icono-estado"></i> ERROR DE CONEXIÓN: ENLACE SATURADO, INTENTA MÁS TARDE.';
      estadoFormulario.className = "caja-estado caja-error";
    }
  });
});
