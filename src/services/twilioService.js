const Twilio = require('twilio');
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendWhatsApp(to, body) {
  // to debe venir con prefijo whatsapp:+<numero>
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER, // ej: 'whatsapp:+1415XXXX'
    to,
    body
  });
}

module.exports = { sendWhatsApp };

