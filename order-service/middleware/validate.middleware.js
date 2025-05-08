const Joi = require('joi');

exports.validateOrder = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    tailorId: Joi.string().optional(),
    fabricType: Joi.string().required(),
    deliveryDate: Joi.date().required(),
    status: Joi.string().optional(),
    totalPrice: Joi.number().required(),
    measurementId: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};