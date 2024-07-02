const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);

router.get('/profile/:id', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.post('/follow/:id', userController.followUser);
router.post('/unfollow/:id', userController.unfollowUser);

module.exports = router;