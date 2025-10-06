const Joi = require('joi');

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors
      stripUnknown: true // Remove unknown properties
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    // Replace request property with validated value
    req[property] = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // User registration
  register: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username must only contain alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must not exceed 30 characters',
        'any.required': 'Username is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must not exceed 128 characters',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'any.required': 'Password is required'
      }),
    role: Joi.string()
      .valid('student', 'admin')
      .default('student')
  }),

  // User login
  login: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
  }),

  // Quiz creation
  createQuiz: Joi.object({
    title: Joi.string()
      .min(3)
      .max(200)
      .required(),
    description: Joi.string()
      .max(1000)
      .allow(''),
    category: Joi.string()
      .max(50)
      .allow(''),
    tags: Joi.array()
      .items(Joi.string().max(30))
      .max(10),
    difficulty: Joi.string()
      .valid('easy', 'medium', 'hard')
      .default('medium'),
    questions: Joi.array()
      .items(
        Joi.object({
          questionText: Joi.string().required(),
          questionType: Joi.string()
            .valid('multiple-choice', 'code')
            .required(),
          options: Joi.array()
            .items(Joi.string())
            .when('questionType', {
              is: 'multiple-choice',
              then: Joi.required().min(2),
              otherwise: Joi.forbidden()
            }),
          correctAnswer: Joi.string()
            .when('questionType', {
              is: 'multiple-choice',
              then: Joi.required(),
              otherwise: Joi.allow('')
            }),
          codeLanguage: Joi.string()
            .when('questionType', {
              is: 'code',
              then: Joi.required(),
              otherwise: Joi.forbidden()
            }),
          starterCode: Joi.string().allow(''),
          evaluationNotes: Joi.string().allow(''),
          referenceSolution: Joi.string().allow(''),
          maxScore: Joi.number().min(0).default(1)
        })
      )
      .min(1)
      .required()
  }),

  // Result submission
  submitExam: Joi.object({
    resultId: Joi.string().required(),
    answers: Joi.array()
      .items(
        Joi.object({
          questionId: Joi.string().required(),
          selectedOption: Joi.string().allow(''),
          textAnswer: Joi.string().allow(''),
          codeAnswer: Joi.string().allow('')
        })
      )
      .required(),
    score: Joi.number().min(0).required()
  }),

  // MongoDB ObjectId
  objectId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid ID format'
      })
  })
};

module.exports = {
  validate,
  schemas
};
