const endpointAPI = "/api/enviar-cotizacion";

// Tu función fetch quedará así:
fetch(endpointAPI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
})
.then(response => {
    if (response.ok) {
        // Mostrar modal de éxito
        document.getElementById('modal-exito').classList.remove('oculto');
    } else {
        alert("Hubo un error al transmitir.");
    }
})
.catch(err => {
    console.error("Error de conexión:", err);
});
