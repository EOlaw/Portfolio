const Comment = require('../models/commentModel');
const Consultation = require('../models/consultationModel');

const commentController = {
    // Create a new comment
    createComment: async (req, res) => {
        try {
            const { consultationId, content } = req.body;
            const comment = new Comment({
                consultationId,
                userId: req.user._id,
                content
            });
            await comment.save();
            res.status(201).json({ comment });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get comments for a consultation
    getCommentsForConsultation: async (req, res) => {
        try {
            const { consultationId } = req.params;
            const comments = await Comment.find({ consultationId }).populate('userId', 'username');
            res.status(200).json({ comments });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a comment
    updateComment: async (req, res) => {
        try {
            const { commentId, content } = req.body;
            const comment = await Comment.findOneAndUpdate(
                { _id: commentId, userId: req.user._id },
                { content },
                { new: true, runValidators: true }
            );
            if (!comment) return res.status(404).json({ error: 'Comment not found' });
            res.status(200).json({ comment });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete a comment
    deleteComment: async (req, res) => {
        try {
            const { commentId } = req.params;
            const comment = await Comment.findOneAndDelete({ _id: commentId, userId: req.user._id });
            if (!comment) return res.status(404).json({ error: 'Comment not found' });
            res.status(200).json({ message: 'Comment deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = commentController;
