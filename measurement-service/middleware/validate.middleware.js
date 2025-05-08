const Joi = require('joi');

exports.validateMeasurement = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    height: Joi.number().required(),
    chest: Joi.number().required(),
    waist: Joi.number().required(),
    hips: Joi.number().required(),
    // Add other measurement fields as needed
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};