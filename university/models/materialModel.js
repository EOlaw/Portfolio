const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref:'Course', required: true}
});

const Material = mongoose.model('Material', materialSchema);
module.exports = Material;