const { body, validationResult } = require('express-validator');

// Función para manejar los errores de validación
const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'Error',
      errors: errors.array(),
    });
  }

  next();
};

// Validación para actualizar usuarios
const updateUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  validFields,
];

// Validación para crear usuarios
const createUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a correct format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
  validFields,
];

// Validación para el login de usuarios
const loginUserValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a correct format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
  validFields,
];

// Validación para actualizar la contraseña de usuarios
const updatePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),
  validFields,
];

// Validación para crear tiendas
const createStoreValidation = [
  body('name')
    .notEmpty()
    .withMessage('Store name is required')
    .isLength({ max: 100 })
    .withMessage('Store name must be at most 100 characters long'),

  body('categorie')
    .notEmpty()
    .withMessage('Store category is required')
    .isLength({ max: 100 })
    .withMessage('Store category must be at most 100 characters long'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be in a valid format'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must have at least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter'),

  // Campos opcionales
  body('address')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Address must be at most 255 characters long'),

  body('locationRadius')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Location radius must be a positive number'),

  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a valid value between -90 and 90'),

  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a valid value between -180 and 180'),

  body('description')
    .optional()

    .isLength({ max: 255 })
    .withMessage('Description must be at most 255 characters long'),

  validFields, // Se asume que esta es una función de validación general
];

const updateStoreValidation = [
  // Validación para el nombre de la tienda (opcional)
  body('name')
    .optional() // Este campo es opcional
    .isLength({ max: 100 })
    .withMessage('Store name must be at most 100 characters long'),

  // Validación para la categoría de la tienda (opcional)
  body('categorie')
    .optional() // Este campo es opcional
    .isLength({ max: 100 })
    .withMessage('Store category must be at most 100 characters long'),

  // Validación para el correo electrónico (opcional)
  body('email')
    .optional() // Este campo es opcional
    .isEmail()
    .withMessage('Email must be in a valid format'),

  // Validación para la dirección (opcional)
  body('address')
    .optional() // Este campo es opcional
    .isLength({ max: 255 })
    .withMessage('Address must be at most 255 characters long'),

  // Validación para el radio de localización (opcional)
  body('locationRadius')
    .optional() // Este campo es opcional
    .isFloat({ gt: 0 })
    .withMessage('Location radius must be a positive number'),

  // Validación para la latitud (opcional)
  body('latitude')
    .optional() // Este campo es opcional
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a valid value between -90 and 90'),

  // Validación para la longitud (opcional)
  body('longitude')
    .optional() // Este campo es opcional
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a valid value between -180 and 180'),

  // Validación para la descripción (opcional)
  body('description')
    .optional() // Este campo es opcional
    .notEmpty()
    .withMessage('Description cannot be empty'),

  validFields, // Llama a la función de manejo de errores de validación
];

module.exports = {
  updateUserValidation,
  createUserValidation,
  loginUserValidation,
  updatePasswordValidation,
  createStoreValidation,
  updateStoreValidation,
};
