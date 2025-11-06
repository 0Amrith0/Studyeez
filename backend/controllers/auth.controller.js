import User from "../models/User.model.js"
import bcrypt from "bcrypt"

import { generateTokenandSetCookie } from "../utils/generateToken.js"

export async function getMe(req, res) {
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function signup(req, res) {
    try {
        const { email, username, password } = req.body;

        const emailRegeX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegeX.test(email)) {
            return res.status(400).json({ error: "Invalid email format" })
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" })
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already in use" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
            email
        })

        if (newUser) {
            generateTokenandSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    coverImg: newUser.coverImg,
                }
            })
        }

    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" })
        }

        generateTokenandSetCookie(user._id, res)

        res.status(201).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                coverImg: user.coverImg,
            }
        })

    } catch (error) {
        console.log("Error in login controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function logout(req, res) {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({ error: "Internal server error" });
    }
}