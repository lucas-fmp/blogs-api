const express = require('express');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware.validateToken);

router.post('/', postController.newPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

module.exports = router;