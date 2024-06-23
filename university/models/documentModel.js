const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    fileUrl: String,
    uploadDate: { type: Date, default: Date.now },
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;