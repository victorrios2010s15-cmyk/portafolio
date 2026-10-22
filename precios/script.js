// 1. Selecciona tu botón de transmitir por su ID o clase
const botonTransmitir = document.getElementById('btn-transmitir'); // <-- Reemplaza 'btn-transmitir' con el ID real de tu botón en el HTML

// 2. Escucha el evento de clic
botonTransmitir.addEventListener('click', (e) => {
    e.preventDefault(); // Evita que la página se recargue si es un formulario

    const endpointAPI = "/api/enviar-cotizacion";
    
    const payload = {
        content: `📩 **Nueva Cotización Recibida**\n` +
                 `**Cliente:** ${document.getElementById('nombre-cliente').value}\n` +
                 `**Total:** ${document.getElementById('total-calculado').textContent}`
    };

    // 3. Ejecuta el fetch al hacer clic
    fetch(endpointAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            alert("¡Cotización enviada con éxito!");
        } else {
            alert("Hubo un error en el servidor.");
        }
    })
    .catch(err => {
        console.error("Error de conexión:", err);
    });
});
