import jwt from "jsonwebtoken"

export const generateTokenandSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: '7d'
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
    });
}