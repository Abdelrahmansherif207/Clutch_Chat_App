import { generateToken } from '../lib/utils.js';
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

const hashPassword = async (pwd) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);

    return hashedPassword;
}

const throw500 = (err, devMessage, res) => {
    console.error(err.message);
    return res.status(500).
        json({
            success: false,
            message: process.env.NODE_ENV
                === 'developement' ?
                err.message : devMessage
        })
}
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await hashPassword(password)
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        generateToken(newUser._id, res);
        await newUser.save();
        const { password: _, ...safeUser } = newUser.toObject();

        return res.status(201).json({
            success: true,
            message: "signed up successfully!",
            data: safeUser
        })
    } catch (err) {
        throw500(err, "Unkown Error While Signup User!");
    }

};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        generateToken(user._id, res);
        return res.status(200)
            .json({
                success: true,
                message: "Logged in successfully!",
                data: {
                    userId: user.id,
                    username: user.username,
                    email: user.email,
                    profilePic: user.profilePic
                }
            })
    } catch (err) {
        throw500(err, "Unkown Error While Login User!", res);
    }
};


export const logout = (_, res) => {
    res.cookie('jwt', "", { maxAge: 0 })
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
};