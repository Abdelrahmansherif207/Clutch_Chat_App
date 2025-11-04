import cloudinary from '../lib/cloudinary.js';
import { generateToken, throw500, hashPassword } from '../lib/utils.js';
import User from '../models/User.js'
import bcrypt from 'bcryptjs'


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


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;


        console.log(profilePic);

        if (!profilePic) return res.status(400).json({ success: false, message: "Profile Pic is required" })

        const userId = req.user._id
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        })

    } catch (err) {
        throw500(err, "Unknown error while updating profile", res)
    }
}