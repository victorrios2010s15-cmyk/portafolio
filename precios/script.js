// 1. Define la ruta de tu API primero
const endpointAPI = "/api/enviar-cotizacion";

// 2. Define tu objeto payload con los datos
const payload = {
    cliente: document.getElementById('nombre-cliente').value,
    total: document.getElementById('total-calculado').textContent,
    servicios: "Servicios seleccionados aquí"
};

// 3. Ejecuta el fetch usando ambas variables ya declaradas
fetch(endpointAPI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
})
.then(response => {
    if (response.ok) {
        console.log("Enviado con éxito");
    }
});