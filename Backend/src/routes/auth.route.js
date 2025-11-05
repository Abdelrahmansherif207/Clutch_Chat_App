import express from 'express';
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import { signupValidationRules, loginValidationRules } from '../validators/auth.validator.js';
import { validate } from '../middlewares/validate.js';
import { protectRoute } from '../middlewares/auth.middleware.js'
import { arcjetProtection } from '../middlewares/arcjet.middleware.js';

const router = express.Router();

// router.use(arcjetProtection);

router.post("/signup", signupValidationRules, validate, signup);

router.post("/login", loginValidationRules, validate, login);

router.post("/logout", logout);

router.put("/profile", updateProfile)

router.get('/check', protectRoute, (req, res) => res.status(200).json(req.user))


export default router;