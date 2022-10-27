const postService = require('../services/post.service');

const newPost = async (req, res) => {
  const { title, content, categoryIds } = postService.validateBody(req.body);
  const token = req.headers.authorization;

  const categoryNotFound = await postService.verifyCategories(categoryIds);

  if (categoryNotFound === true) {
    return res.status(400).json({ message: 'one or more "categoryIds" not found' });
  }
  if (categoryNotFound === false) {
    const post = await postService.addNewPost({ title, content, categoryIds, token });

    return res.status(201).json(post);
  }
};

module.exports = {
  newPost,
};