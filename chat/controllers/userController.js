const User = require('../models/userModel');

const userController = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found'
        });
      }
      // res.render('profile', { user, currentUser: req.user });
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        bio: req.body.bio,
        profilePicture: req.body.profilePicture
      }, { new: true, runValidators: true });

      res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  },

  followUser: async (req, res) => {
    try {
      const userToFollow = await User.findById(req.params.id);
      if (!userToFollow) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found'
        });
      }

      if (userToFollow.followers.includes(req.user.id)) {
        return res.status(400).json({
          status: 'fail',
          message: 'You are already following this user'
        });
      }

      await User.findByIdAndUpdate(req.params.id, {
        $push: { followers: req.user.id }
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: { following: req.params.id }
      });

      res.status(200).json({
        status: 'success',
        message: 'Successfully followed user'
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  },

  unfollowUser: async (req, res) => {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      if (!userToUnfollow) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found'
        });
      }

      if (!userToUnfollow.followers.includes(req.user.id)) {
        return res.status(400).json({
          status: 'fail',
          message: 'You are not following this user'
        });
      }

      await User.findByIdAndUpdate(req.params.id, {
        $pull: { followers: req.user.id }
      });
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { following: req.params.id }
      });

      res.status(200).json({
        status: 'success',
        message: 'Successfully unfollowed user'
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  }
};

module.exports = userController;
