const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement