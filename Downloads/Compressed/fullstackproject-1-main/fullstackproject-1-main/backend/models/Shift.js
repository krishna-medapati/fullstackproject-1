const mongoose = require('mongoose');
const ShiftSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  location: { type: String },
  status: { type: String, enum: ['scheduled','completed','cancelled'], default: 'scheduled' },
  notes: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Shift', ShiftSchema);
