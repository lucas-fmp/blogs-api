require('dotenv/config');
const jwt = require('jsonwebtoken');

const createToken = (data) => {
  const token = jwt.sign({ data }, process.env.JWT_SECRET, {
    algorithm: 'HS256',
  });

  return token;
};

const validateToken = (token) => {
  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (_e) {
    const error = new Error('Expired or invalid token');
    error.status = 401;

    throw error;
  }
};

module.exports = {
  createToken,
  validateToken,
};