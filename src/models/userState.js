import mongoose from 'mongoose';

const userStateSchema = new mongoose.Schema({
  phone: { type: String, unique: true, required: true },
  state: { type: String, required: true },
  data: { type: Object, default: {} },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('UserState', userStateSchema);
