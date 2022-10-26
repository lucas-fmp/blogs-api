const userService = require('../services/user.service');
const authService = require('../services/auth.service');

const newUser = async (req, res) => {
  const { displayName, email, password, image } = userService.validateBody(req.body);

  await userService.addNewUser({ displayName, email, password, image });

  const token = await authService.validateLogin({ email, password });

  res.status(201).json({ token });
};

module.exports = {
  newUser,
};
