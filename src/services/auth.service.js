const Joi = require('joi');
const jwtUtil = require('../utils/jwt.util');

const { User } = require('../models');

const validateBody = (params) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error, value } = schema.validate(params);

  if (error) {
    error.status = 400;
    error.message = 'Some required fields are missing';
    
    throw error;
  }

  return value;
};

const validateLogin = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

  if (!user || user.password !== password) {
    const error = new Error('Invalid fields');
    error.status = 400;
    throw error;
  }

  const { password: _, ...userWithoutPassword } = user.dataValues;

  const token = jwtUtil.createToken(userWithoutPassword);

  return token;
};

const validateToken = (token) => {
  if (!token) {
    const error = new Error('Token not found');
    error.status = 401;

    throw error;
  }

  const user = jwtUtil.validateToken(token);

  return user;
};

module.exports = {
  validateBody,
  validateLogin,
  validateToken,
};