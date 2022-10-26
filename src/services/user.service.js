const Joi = require('joi');

const { User } = require('../models');

const validateBody = (params) => {
  const schema = Joi.object({
    displayName: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    image: Joi.string(),
  });

  const { error, value } = schema.validate(params);

  if (error) {
    error.status = 400;
    
    throw error;
  }

  return value;
};

const addNewUser = async ({ displayName, email, password, image }) => {
  const user = await User.findOne({ where: { email } });

  if (user) {
    const error = new Error('User already registered');
    error.status = 409;

    throw error;
  }

  return User.create({ displayName, email, password, image });
};

const getUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });

  return users;
};

module.exports = {
  validateBody,
  addNewUser,
  getUsers,
};