export default async function handler(req, res) {
    // 1. Asegurar que solo reciba peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // 2. Obtener el Webhook desde la variable secreta de la nube (Oculta al público)
    const discordWebhookURL = process.env.DISCORD_WEBHOOK_URL;

    if (!discordWebhookURL) {
        return res.status(500).json({ error: 'Webhook no configurado en el servidor' });
    }

    try {
        const payload = req.body;

        // 3. El servidor de Vercel reenvía los datos a Discord de forma oculta
        const discordResponse = await fetch(discordWebhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (discordResponse.ok) {
            return res.status(200).json({ success: true, message: 'Transmitido con éxito' });
        } else {
            return res.status(500).json({ error: 'Error al comunicarse con Discord' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
