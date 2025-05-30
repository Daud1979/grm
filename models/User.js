import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  role:     { type: String, enum: ['admin', 'profesor', 'alumno'], default: 'alumno' },
  password: { type: String, required: true }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (cand) {
  return bcrypt.compare(cand, this.password);
};

export default model('User', userSchema);
