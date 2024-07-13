const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({
    consultationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
