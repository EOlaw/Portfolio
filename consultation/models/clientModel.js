const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  company: { type: String, required: true },
  jobTitle: { type: String, required: true },
  projects: [{ type: String }],
  profilePicture: { type: String }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;