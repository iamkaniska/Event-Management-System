const { body } = require('express-validator');

exports.createEventValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative')
];

exports.updateEventValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be non-negative')
];