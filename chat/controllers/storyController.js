const Story = require('../models/storyModel');
const User = require('../models/userModel');

const storyController = {
  createStory: async (req, res) => {
    try {
      const newStory = await Story.create({
        user: req.user.id,
        image: req.file.path
      });

      res.status(201).json({
        status: 'success',
        data: {
          story: newStory
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  },

  getStories: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const following = [...user.following, req.user.id];

      const stories = await Story.find({
        user: { $in: following },
        createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Stories from the last 24 hours
      }).populate('user', 'username profilePicture');

      res.status(200).json({
        status: 'success',
        data: {
          stories
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

module.exports = storyController;
