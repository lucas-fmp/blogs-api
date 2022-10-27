const Joi = require('joi');
const { PostCategory, BlogPost, sequelize, Category, User } = require('../models');
const jwtUtil = require('../utils/jwt.util');

const validateBody = (params) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    categoryIds: Joi.array().required(),
  });

  const { error, value } = schema.validate(params);

  if (error) {
    error.status = 400;
    error.message = 'Some required fields are missing';
    
    throw error;
  }

  return value;
};

const verifyCategories = async (categoryIds) => {
  const promises = categoryIds.map((category) => Category.findByPk(category));

  const categories = await Promise.all(promises);

  const categoryNotFound = categories.includes(null);

  return categoryNotFound;
};

const addNewPost = async ({ title, content, categoryIds, token }) => {
  const { id: userId } = jwtUtil.validateToken(token);

  try {
    const result = await sequelize.transaction(async (t) => {
      const { dataValues } = await BlogPost.create({ title, content, userId }, { transaction: t });

      const postCategoryArray = categoryIds.map((category) => ({
        postId: dataValues.id,
        categoryId: category,
      }));
  
      await PostCategory.bulkCreate(postCategoryArray, { transaction: t });
    
      return dataValues;
    });
    
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPosts = async () => {
  const posts = await BlogPost.findAll({
    raw: true,
  });

  const users = await User.findAll({
    raw: true,
    attributes: { exclude: ['password'] },
  });

  const categories = await Category.findAll({
    raw: true,
  });

  const allDataPosts = posts.map((post, index) => ({
    ...post,
    user: users[index],
    categories: [categories[index]],
  }));

  return allDataPosts;
};

module.exports = {
  validateBody,
  verifyCategories,
  addNewPost,
  getPosts,
};