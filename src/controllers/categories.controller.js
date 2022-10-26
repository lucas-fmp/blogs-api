const categoriesService = require('../services/categories.service');

const newCategory = async (req, res) => {
  const { name } = categoriesService.validateBody(req.body);

  const category = await categoriesService.addNewCategory(name);

  return res.status(201).json(category);
};

const getCategories = async (_req, res) => {
  const categories = await categoriesService.getCategories();

  return res.status(200).json(categories);
};

module.exports = {
  newCategory,
  getCategories,
};