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

const getPosts = async (_req, res) => {
  const posts = await postService.getPosts();

  return res.status(200).json(posts);
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await postService.getPostById(id);

  console.log(post);

  if (!post.user) {
    return res.status(404).json({ message: 'Post does not exist' });
  }

  return res.status(200).json(post);
};

module.exports = {
  newPost,
  getPosts,
  getPostById,
};