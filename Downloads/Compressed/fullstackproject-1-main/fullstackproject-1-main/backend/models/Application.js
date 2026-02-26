const mongoose = require('mongoose');
const ApplicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  hoursWorked: { type: Number, default: 0 },
  notes: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Application', ApplicationSchema);
