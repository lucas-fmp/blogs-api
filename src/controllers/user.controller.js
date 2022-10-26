const userService = require('../services/user.service');
const authService = require('../services/auth.service');

const newUser = async (req, res) => {
  const { displayName, email, password, image } = userService.validateBody(req.body);

  await userService.addNewUser({ displayName, email, password, image });

  const token = await authService.validateLogin({ email, password });

  res.status(201).json({ token });
};

const getUsers = async (req, res) => {
  const users = await userService.getUsers();

  return res.status(200).json(users);
};

module.exports = {
  newUser,
  getUsers,
};
