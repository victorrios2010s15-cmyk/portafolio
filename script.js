const formulario = document.getElementById('formulario-contacto');
const estadoFormulario = document.getElementById('estado-formulario');

formulario.addEventListener('submit', async function(evento) {
  evento.preventDefault();
  
  const nombre = this.querySelector('input[name="nombre"]').value.trim();
  const correo = this.querySelector('input[name="correo"]').value.trim();
  const mensaje = this.querySelector('textarea[name="mensaje"]').value.trim();

  if (nombre === "" || correo === "" || mensaje === "") {
    estadoFormulario.textContent = "SISTEMA ERROR: TODOS LOS CAMPOS SON OBLIGATORIOS.";
    estadoFormulario.className = "form-status status-error";
    return;
  }

  const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!expresionCorreo.test(correo)) {
    estadoFormulario.textContent = "SISTEMA ERROR: DIRECCIÓN DE CORREO INVÁLIDA.";
    estadoFormulario.className = "form-status status-error";
    return;
  }

  const datosFormulario = new FormData(this);

  estadoFormulario.textContent = "CONECTANDO CON EL SERVIDOR...";
  estadoFormulario.className = "form-status status-success";

  try {
    const respuesta = await fetch(this.action, {
      method: this.method,
      body: datosFormulario,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (respuesta.ok) {
      estadoFormulario.textContent = "¡MENSAJE RECIBIDO CON ÉXITO! TE RESPONDERÉ PRONTO.";
      estadoFormulario.className = "form-status status-success";
      formulario.reset();
    } else {
      throw new Error('Error en servidor');
    }
  } catch (error) {
    estadoFormulario.textContent = "ERROR DE CONEXIÓN: NO SE PUDO ENVIAR EL MENSAJE.";
    estadoFormulario.className = "form-status status-error";
  }
});
