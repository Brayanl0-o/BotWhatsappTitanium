import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  phone: String,
  direction: { type: String, enum: ['in', 'out'] },
  body: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Message', messageSchema);
