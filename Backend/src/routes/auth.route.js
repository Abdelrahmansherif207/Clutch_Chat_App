import express from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';
import { signupValidationRules } from '../validators/auth.validator.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

// Apply validation middleware to signup route
router.post("/signup", signupValidationRules, validate, signup);

router.post("/login", login);

router.get("/logout", logout);

export default router;