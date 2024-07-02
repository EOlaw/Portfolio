const express = require('express');
const router = express.Router();
const multer = require('multer');
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.use(authMiddleware.protect);

router.post('/', upload.single('image'), storyController.createStory);
router.get('/', storyController.getStories);

module.exports = router;