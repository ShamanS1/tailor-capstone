const service = require('../services/user.service');

exports.register = async (req, res, next) => {
  try {
    // Extract user ID from the JWT token (assumes verifyToken middleware sets req.user)
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID found in token' });
    }

    // Build user profile data, linking to login-control-service user
    const profileData = {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      mobileNumber: req.body.mobileNumber,
      address: req.body.address,
      photo: req.body.photo, // optional, if your model supports it
      role: req.body.role,
      loginUserId: userId // add this field to link with login-control-service user
    };

    // Remove password if present in body (should not be stored here)
    delete profileData.password;

    const user = await service.createUser(profileData);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res) => {
  const users = await service.getAllUsers();
  res.json(users);
};

exports.getById = async (req, res) => {
  const user = await service.getUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

exports.update = async (req, res) => {
  const user = await service.updateUser(req.params.id, req.body);
  res.json(user);
};

exports.remove = async (req, res) => {
  await service.deleteUser(req.params.id);
  res.status(200).json({ message: 'User deleted successfully' });
};
