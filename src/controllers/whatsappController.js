import twilio from 'twilio';
import { getState, setState, clearState, saveMessage, updateUserData } from '../services/stateService.js';

const MessagingResponse = twilio.twiml.MessagingResponse;
const cedulaRegex = /^\d{6,10}$/;

// Regex simple para "dirección": al menos 10 caracteres, alfanuméricos y espacios
const direccionRegex = /^[a-zA-Z0-9\s,.-]{10,}$/;

export async function handleIncoming(req, res) {
  try {
    const from = req.body.From || '';
    const body = (req.body.Body || '').trim();
    const message = body.toLowerCase();

    console.log('Incoming:', from, body);
    await saveMessage(from, 'in', body);

    const twiml = new MessagingResponse();
    const state = await getState(from);

    // 💬 Inicio de conversación
    if (["hola", "buenas", "saludos"].includes(message)) {
      await setState(from, 'menu', {});
      twiml.message(
        "👋 ¡Saludos!\nEs un gusto poder ayudarle. Por favor indíqueme el requerimiento que desea realizar:\n\n1️⃣ Condonación de deuda\n2️⃣ Cambio de operadora\n3️⃣ Servicio de hogar"
      );

    // 📝 Opción 1: Condonación de deuda
    } else if (message === "1" || state === 'cedula') {
      if (message === "1") {
        await setState(from, 'cedula', {});
        twiml.message("✅ Por favor envíe el número de cédula que desea consultar.");
      } else if (cedulaRegex.test(body)) {
        // Guardar cédula en DB
        await updateUserData(from, { cedula: body });
        twiml.message("🔎 Un momento por favor, estamos validando la información...");
        await saveMessage(from, 'out', 'Validando cédula...');
        await clearState(from);
      } else {
        twiml.message("❌ Eso no parece una cédula válida. Por favor envíe un número de cédula correcto (6 a 10 dígitos).");
      }

    // 📝 Opción 2: Cambio de operadora
    } else if (message === "2" || state === 'operador') {
      if (message === "2") {
        await setState(from, 'operador', {});
        twiml.message("📱 Indíqueme:\n- Operador actual\n- Si tiene un plan o va a hacer recarga");
      } else if (message.length > 3) {
        // Guardar operador en DB
        await updateUserData(from, { operador: body });
        twiml.message("🔍 Gracias, estamos validando los datos del operador...");
        await saveMessage(from, 'out', 'Validando operador...');
        await clearState(from);
      } else {
        twiml.message("❌ No entendí los datos del operador. Por favor envíe el nombre del operador y si tiene un plan o va a hacer recarga.");
      }

    // 📝 Opción 3: Servicio de hogar
    } else if (message === "3" || state === 'direccion') {
      if (message === "3") {
        await setState(from, 'direccion', {});
        twiml.message("🏠 Por favor envíe la dirección completa donde desea utilizar el servicio (calle, número, ciudad).");
      } else if (direccionRegex.test(body)) {
        // Guardar dirección en DB
        await updateUserData(from, { direccion: body });
        twiml.message("📍 Gracias, la dirección ha sido recibida. En breve confirmaremos si podemos ofrecer el servicio en su zona.");
        await saveMessage(from, 'out', 'Dirección validada');
        await clearState(from);
      } else {
        twiml.message("❌ No reconocí la dirección. Por favor envíe la dirección completa incluyendo calle, número y ciudad, mínimo 10 caracteres.");
      }

    // ❗ Cualquier otro mensaje fuera de flujo
    } else {
      twiml.message(
        "⚠️ No entendí su solicitud.\nPor favor, envíe una de las opciones válidas:\n1️⃣ Condonación de deuda\n2️⃣ Cambio de operadora\n3️⃣ Servicio de hogar"
      );
    }

    res.type('text/xml').send(twiml.toString());
  } catch (err) {
    console.error('Error webhook:', err);
    res.sendStatus(500);
  }
}
