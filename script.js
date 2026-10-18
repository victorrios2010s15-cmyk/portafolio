const discordWebhookURL = "https://discord.com/api/webhooks/1561447100405911653/p6o6LsuLKKPJ3oZ4NKzy-EiU-gCH0FkqMBpzvu86yTNwfNy_XqJEJjDcR1onVZcKHs1i";

btnSolicitar.addEventListener('click', (e) => {
    e.preventDefault();

    let total = 0;
    let serviciosSeleccionados = [];

    // Recorremos los checkboxes seleccionados
    checkboxes.forEach(chk => {
        if (chk.checked || chk.disabled) {
            const nombreServicio = chk.parentElement.textContent.trim();
            const precio = parseFloat(chk.getAttribute('data-precio'));
            serviciosSeleccionados.push(`• ${nombreServicio} ($${precio} USD)`);
            total += precio;
        }
    });

    const cantidadPaginas = parseInt(inputPaginas.value) || 0;
    if (cantidadPaginas > 0) {
        serviciosSeleccionados.push(`• ${cantidadPaginas} Página(s) adicional(es) ($${cantidadPaginas * 10} USD)`);
        total += (cantidadPaginas * 10);
    }

    // Estructura de la tarjeta (Embed) que llegará a tu canal de Discord
    const payload = {
        username: "Cotizador Web",
        avatar_url: "https://i.imgur.com/4M34hi2.png",
        embeds: [
            {
                title: "📌 ¡Nuevo Presupuesto Solicitado!",
                color: 5793266, // Color púrpura/azul estilo Discord
                fields: [
                    {
                        name: "Servicios Seleccionados:",
                        value: serviciosSeleccionados.length > 0 ? serviciosSeleccionados.join('\n') : "Ninguno seleccionado",
                        inline: false
                    },
                    {
                        name: "💰 Total Estimado:",
                        value: `**$${total} USD**`,
                        inline: true
                    }
                ],
                footer: {
                    text: "Enviado desde el Cotizador de tu Sitio Web"
                },
                timestamp: new Date().toISOString()
            }
        ]
    };

    // Cambiamos temporalmente el texto del botón
    const textoOriginal = btnSolicitar.textContent;
    btnSolicitar.textContent = "TRANSMITIENDO...";
    btnSolicitar.disabled = true;

    // Enviar los datos al Webhook de Discord
    fetch(discordWebhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            alert('¡Tu presupuesto ha sido transmitido con éxito! Nos pondremos en contacto contigo lo antes posible.');
        } else {
            alert('Hubo un inconveniente al enviar el presupuesto. Por favor, contáctanos directamente.');
        }
    })
    .catch(err => {
        console.error('Error al enviar a Discord:', err);
        alert('Ocurrió un error de conexión al enviar.');
    })
    .finally(() => {
        btnSolicitar.textContent = textoOriginal;
        btnSolicitar.disabled = false;
    });
});

