/**
 * Enviar mensaje al webhook de Discord
 */

export async function sendToDiscord(email, message) {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    // En desarrollo sin webhook, simular éxito
    if (import.meta.env.DEV) {
      console.log('📨 Mensaje (dev):', { email, message })
      return
    }
    throw new Error('Webhook no configurado')
  }

  const payload = {
    embeds: [{
      title: '📬 Mensaje de FacturaView',
      color: 3447003,
      fields: [
        {
          name: 'Email',
          value: email || '_No proporcionado_',
          inline: true
        },
        {
          name: 'Mensaje',
          value: message.substring(0, 1024)
        }
      ],
      timestamp: new Date().toISOString()
    }]
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Discord error: ${response.status}`)
  }
}
