import { body } from 'express-validator';

export const signupValidationRules = [
    body('username')
        .isString()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3 and 20 characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),

    body('password')
        .isString()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

export const loginValidationRules = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),

    body('password')
        .isString()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
]