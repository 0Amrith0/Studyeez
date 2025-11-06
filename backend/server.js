import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js" ;
import authRoutes from "./routes/auth.route.js";
import bookRoutes from "./routes/book.route.js";
import noteRoutes from "./routes/note.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 6060;

const __dirname = path.resolve();

app.use(cors({ origin: 'http://localhost:5174', 
    credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/books/notes", noteRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get(/.*/, (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}


app.listen(PORT, async() => {
    await connectDB();
    console.log(`Server started on PORT: ${PORT}`);
});