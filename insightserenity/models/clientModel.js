const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String },
    industry: { type: String },
    contactPerson: { type: String }, 
    address: { type: String },
    website: { type: String }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema)
module.exports = Client