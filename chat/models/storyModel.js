const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt: { type: Date, default: Date.now, expires: 86400 } // 24 hours
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);
module.exports = Story;