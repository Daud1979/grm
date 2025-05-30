import mongoose from 'mongoose';
export default async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🟢 MongoDB conectado');
  } catch (err) {
    console.error('🔴 Error de conexión', err);
    process.exit(1);
  }
};
