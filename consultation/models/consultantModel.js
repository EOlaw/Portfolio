const mongoose = require('mongoose');

const consultantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, required: true },
  specializations: [{ type: String, required: true }],
  experience: { type: Number, required: true },
  phoneNumber: { type: Number, required: true },
  certifications: [{ type: String }],
  bio: { type: String },
  websites: [{ type: String }],
  profilePicture: { type: String },
  availability: { type: Boolean, default: true },
  rating: { type: Number, min: 0, max: 5 }
}, { timestamps: true });

const Consultant = mongoose.model('Consultant', consultantSchema);
module.exports = Consultant;
