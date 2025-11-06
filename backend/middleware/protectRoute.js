import User from "../models/User.model.js"
import jwt from "jsonwebtoken";

export default async function protectRoute(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({ error: "Unauthorized: No Token Provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({ error: "User not found"})
        }

        req.user = user;
        next();

    } catch (error) {
        console.error("Error in protectRoute middleware", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}