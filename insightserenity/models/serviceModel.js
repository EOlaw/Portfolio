const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true }, // duration in minutes
    price: { type: Number, required: true },
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
