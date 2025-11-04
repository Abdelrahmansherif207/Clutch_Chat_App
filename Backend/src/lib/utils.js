import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms - 7 days
        httpOnly: true, // for XSS
        sameSite: "strict", // for csrf
        secure: process.env.NODE_ENV === "development" ? false : true
    })
}

export const hashPassword = async (pwd) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);

    return hashedPassword;
}

export const throw500 = (err, devMessage, res) => {
    console.error(err.message);
    return res.status(500).
        json({
            success: false,
            message: process.env.NODE_ENV
                === 'developement' ?
                err.message : devMessage
        })
}