const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultantSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: [String], required: true },
    experienceYears: { type: Number, min: 0 },
    bio: { type: String },
    certifications: { type: [String] },
    linkedInProfile: { type: String },
    availability: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5 }
}, { timestamps: true });


const Consultant = mongoose.model('Consultant', consultantSchema);
module.exports = Consultant;
