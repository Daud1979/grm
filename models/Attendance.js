import mongoose from 'mongoose';
const { Schema, model } = mongoose;
export default model('Attendance', new Schema({
  student:   { type: Schema.Types.ObjectId, ref: 'Student' },
  subject:   { type: Schema.Types.ObjectId, ref: 'Subject' },
  date:      { type: Date, default: Date.now },
  status:    { type: String, enum: ['presente', 'ausente'], default: 'presente' }
}));
