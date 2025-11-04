import { generateToken } from '../lib/utils.js';
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

const hashPassword = async (pwd) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);

    return hashedPassword;
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
            status: "success",
            message: "signed up successfully!",
            data: safeUser
        })
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ status: "fail", message: process.env.NODE_ENV === 'developement' ? err.message : "Unkown error while adding user" })
    }

};

export const login = async (req, res) => { };
export const logout = async (req, res) => { };