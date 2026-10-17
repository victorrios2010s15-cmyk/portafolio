const formulario = document.getElementById('formulario-contacto');
const estadoFormulario = document.getElementById('estado-formulario');

formulario.addEventListener('submit', async function(evento) {
  evento.preventDefault();
  
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
    estadoFormulario.textContent = "ERROR AL ENVIAR. INTÉNTALO DE NUEVO.";
    estadoFormulario.className = "form-status status-error";
  }
});
