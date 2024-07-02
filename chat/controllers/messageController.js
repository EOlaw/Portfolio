const Message = require('../models/messageModel');

const messageController = {
  sendMessage: async (req, res) => {
    try {
      const newMessage = await Message.create({
        sender: req.user.id,
        recipient: req.params.recipientId,
        text: req.body.text
      });

      res.status(201).json({
        status: 'success',
        data: {
          message: newMessage
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  },

  getConversation: async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: req.user.id, recipient: req.params.userId },
          { sender: req.params.userId, recipient: req.user.id }
        ]
      }).sort('createdAt');

      res.status(200).json({
        status: 'success',
        data: {
          messages
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  }
};

module.exports = messageController;
