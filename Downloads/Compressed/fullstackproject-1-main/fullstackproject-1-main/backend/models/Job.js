const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String },
  hoursPerWeek: { type: Number },
  pay: { type: Number },
  slots: { type: Number, default: 1 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });
module.exports = mongoose.model('Job', JobSchema);
