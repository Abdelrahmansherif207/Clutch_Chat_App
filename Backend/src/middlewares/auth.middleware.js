import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { throw500 } from '../lib/utils.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized no token provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized invalid token" })
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        req.user = user;
        next()
    } catch (err) {
        console.log("error in protect route middleware")
        throw500(err, "Internal Server Error", res)
    }
};
