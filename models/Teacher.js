import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export default model('Teacher', new Schema({
  nombre: String,
  email: { type: String, unique: true },
  telefono: String
}));
