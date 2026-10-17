const formulario = document.getElementById('formulario-contacto');
const estadoFormulario = document.getElementById('estado-formulario');

formulario.addEventListener('submit', async function(evento) {
  evento.preventDefault();
  
  const nombre = this.querySelector('input[name="nombre"]').value.trim();
  const correo = this.querySelector('input[name="correo"]').value.trim();
  const mensaje = this.querySelector('textarea[name="mensaje"]').value.trim();

  estadoFormulario.style.display = "none";
  estadoFormulario.className = "caja-estado";

  if (nombre === "" || correo === "" || mensaje === "") {
    estadoFormulario.innerHTML = '<i class="fa-solid fa-triangle-exclamation icono-estado"></i> TERMINAL: TODOS LOS CAMPOS SON OBLIGATORIOS.';
    estadoFormulario.className = "caja-estado caja-error";
    return;
  }

  const filtroNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,}(?:\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,})+$/;
  if (!filtroNombre.test(nombre)) {
    estadoFormulario.innerHTML = '<i class="fa-solid fa-user-shield icono-estado"></i> ERROR SEGURIDAD: INGRESA NOMBRE Y APELLIDO REALES.';
    estadoFormulario.className = "caja-estado caja-error";
    return;
  }

  const patronRepetido = /(.)\1{3,}/;
  if (patronRepetido.test(nombre) || patronRepetido.test(mensaje)) {
    estadoFormulario.innerHTML = '<i class="fa-solid fa-bug icono-estado"></i> ERROR DE ENTRADA: DETECTADO TEXTO BASURA O REPETITIVO.';
    estadoFormulario.className = "caja-estado caja-error";
    return;
  }

  const filtroCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!filtroCorreo.test(correo)) {
    estadoFormulario.innerHTML = '<i class="fa-solid fa-envelope-circle-check icono-estado"></i> ERROR: FORMATO DE CORREO INVÁLIDO.';
    estadoFormulario.className = "caja-estado caja-error";
    return;
  }

  estadoFormulario.innerHTML = '<i class="fa-solid fa-spinner fa-spin icono-estado"></i> CONECTANDO CON EL SERVIDOR DE SEGURIDAD...';
  estadoFormulario.className = "caja-estado caja-exito";

  const datosFormulario = new FormData(this);

  try {
    const respuesta = await fetch(this.action, {
      method: this.method,
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
