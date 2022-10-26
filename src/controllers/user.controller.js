const userService = require('../services/user.service');
const authService = require('../services/auth.service');

const newUser = async (req, res) => {
  const { displayName, email, password, image } = userService.validateBody(req.body);

  await userService.addNewUser({ displayName, email, password, image });

  const token = await authService.validateLogin({ email, password });

  res.status(201).json({ token });
};

const getUsers = async (_req, res) => {
  const users = await userService.getUsers();

  return res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  res.status(200).json(user);
};

module.exports = {
  newUser,
  getUsers,
  getUserById,
};
