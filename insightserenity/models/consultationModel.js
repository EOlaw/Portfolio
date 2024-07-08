const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultationSchema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    consultantId: { type: Schema.Types.ObjectId, ref: 'Consultant', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    mode: { type: String, enum: ['In-person', 'Online'], required: true },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'canceled'], default: 'pending' },
    requestedDate: { type: Date },
    ratings: [{
        client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comments: { type: String }
    }]
}, { timestamps: true });

const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;
