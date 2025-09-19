import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://brayan:A1234567-s@cluster0.zabqfox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export async function connectDB() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI no está definida. Verifica tu .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}
