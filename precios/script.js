// 1. Primero defines y llenas el objeto con los datos que vas a enviar
const payload = {
    cliente: document.getElementById('nombre-cliente').value,
    total: document.getElementById('total-calculado').textContent,
    servicios: "Servicios seleccionados aquí" 
};

// 2. Justo después ejecutas el fetch usando ese payload ya creado
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