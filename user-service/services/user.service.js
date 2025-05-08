const User = require('../models/user.model');

const createUser = async (userData) => {
  const existingUser = await User.findOne({ username: userData.username });
  if (existingUser) throw new Error('Username already taken');

  const existingEmail = await User.findOne({ email: userData.email });
  if (existingEmail) throw new Error('Email already registered');

  const user = new User(userData);
  return await user.save();
};

const getAllUsers = async () => await User.find();

const getUserById = async (id) => await User.findById(id);

const updateUser = async (id, data) => await User.findByIdAndUpdate(id, data, { new: true });

const deleteUser = async (id) => await User.findByIdAndDelete(id);

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
