import { body, param } from 'express-validator';
import User from '../models/User.js';

const validateMessage = [
    // Validate text or image is provided
    body('text')
        .optional()
        .isString()
        .trim()
        .withMessage('Text must be a valid string'),
        
    body('image')
        .optional()
        .isString()
        .withMessage('Image must be a valid string'),
        
    // Main validation middleware
    async (req, res, next) => {
        // Check if either text or image is provided
        if (!req.body.text && !req.body.image) {
            return res.status(400).json({
                success: false,
                message: 'Either text or image is required'
            });
        }

        // Validate receiver ID format
        if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID'
            });
        }

        try {
            // Check if receiver exists
            const receiver = await User.findById(req.params.id);
            if (!receiver) {
                return res.status(400).json({
                    success: false,
                    message: 'Receiver not found'
                });
            }
            
            // Check if sender and receiver are the same
            if (req.params.id === req.user._id.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot send message to yourself'
                });
            }
            
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Error validating message'
            });
        }
    }
];

export { validateMessage };