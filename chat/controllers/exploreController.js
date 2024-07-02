const Post = require('../models/postModel');
const User = require('../models/userModel');

const contentController = {
  getExploreContent: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const following = user.following;

      const posts = await Post.aggregate([
        { $match: { user: { $nin: following } } },
        { $sample: { size: 30 } },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { 'user.password': 0 } }
      ]);

      res.status(200).json({
        status: 'success',
        data: {
          posts
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

module.exports = contentController;
