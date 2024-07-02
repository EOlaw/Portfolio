const express = require('express');
const router = express.Router();
const multer = require('multer');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.use(authMiddleware.protect);

router.post('/', upload.single('image'), postController.createPost);
router.get('/feed', postController.getFeed);
router.get('/search', postController.searchPosts);
router.post('/:id/like', postController.likePost);
router.post('/:id/unlike', postController.unlikePost);
router.post('/:id/comment', postController.commentOnPost);

module.exports = router;