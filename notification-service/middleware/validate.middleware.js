const Joi = require('joi');

exports.validateNotification = (req, res, next) => {
  const schema = Joi.object({
    tailorId: Joi.string().optional(),
    userId: Joi.string().required(),
    orderId: Joi.string().optional(),
    message: Joi.string().min(1).required(),
    status: Joi.string().valid('UNREAD', 'READ').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};