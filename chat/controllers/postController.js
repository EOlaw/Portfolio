const Post = require('../models/postModel');
const User = require('../models/userModel');

const postController = {
  createPost: async (req, res) => {
    try {
      const { caption } = req.body;
      const hashtags = caption.match(/#[a-z0-9_]+/gi) || [];

      const newPost = await Post.create({
        user: req.user.id,
        caption,
        image: req.file.path,
        hashtags: hashtags.map(tag => tag.toLowerCase())
      });

      res.status(201).json({
        status: 'success',
        data: {
          post: newPost
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  },

  getFeed: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const following = user.following;

      const posts = await Post.find({ user: { $in: following } })
        .populate('user', 'username profilePicture')
        .populate('comments.user', 'username profilePicture')
        .sort('-createdAt');

      res.status(200).json({
        status: 'success',
        results: posts.length,
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
  },

  searchPosts: async (req, res) => {
    try {
      const { query } = req.query;
      const posts = await Post.find({
        $or: [
          { caption: { $regex: query, $options: 'i' } },
          { hashtags: { $regex: query, $options: 'i' } }
        ]
      }).populate('user', 'username profilePicture');

      res.status(200).json({
        status: 'success',
        results: posts.length,
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
  },

  likePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          status: 'fail',
          message: 'Post not found'
        });
      }

      if (post.likes.includes(req.user.id)) {
        return res.status(400).json({
          status: 'fail',
          message: 'You have already liked this post'
        });
      }

      post.likes.push(req.user.id);
      await post.save();

      res.status(200).json({
        status: 'success',
        message: 'Post liked successfully'
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  },

  unlikePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          status: 'fail',
          message: 'Post not found'
        });
      }

      if (!post.likes.includes(req.user.id)) {
        return res.status(400).json({
          status: 'fail',
          message: 'You have not liked this post'
        });
      }

      post.likes = post.likes.filter(id => id.toString() !== req.user.id.toString());
      await post.save();

      res.status(200).json({
        status: 'success',
        message: 'Post unliked successfully'
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  },

  commentOnPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          status: 'fail',
          message: 'Post not found'
        });
      }

      const newComment = {
        user: req.user.id,
        text: req.body.text
      };

      post.comments.push(newComment);
      await post.save();

      // Populate the user information for the new comment
      const populatedComment = await Post.populate(newComment, {
        path: 'user',
        select: 'username profilePicture'
      });

      res.status(201).json({
        status: 'success',
        data: {
          comment: populatedComment
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

module.exports = postController;
