import UserState from '../models/UserState.js';
import Message from '../models/Message.js';

export async function getState(phone) {
  const user = await UserState.findOne({ phone });
  return user ? user.state : null;
}

export async function setState(phone, state, data = {}) {
  return UserState.findOneAndUpdate(
    { phone },
    { state, data, updatedAt: new Date() },
    { upsert: true, new: true }
  );
}

export async function clearState(phone) {
  return UserState.findOneAndDelete({ phone });
}

export async function saveMessage(phone, direction, body) {
  return Message.create({ phone, direction, body });
}


export async function updateUserData(phone, newData) {
  try {
    const user = await UserState.findOneAndUpdate(
      { phone },
      { $set: { data: newData } },
      { new: true, upsert: true }
    );
    return user;
  } catch (err) {
    console.error("Error al actualizar los datos del usuario:", err);
    throw err;
  }
}
