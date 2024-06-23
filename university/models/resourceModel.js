const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    capacity: Number,
    equipment: [String],
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;