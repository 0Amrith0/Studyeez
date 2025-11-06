import Book from "../models/Book.model.js"
import User from "../models/User.model.js";


export async function newBook(req, res) {
    try {
        const userId = req.user._id;
        const file = req.file;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!file) {
            return res.status(400).json({ message: "Please upload a PDF file" });
        }

        if (file.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "Only PDF files are allowed" });
        }

        const newBook = new Book({
            user: userId,
            title: file.originalname,
            filePath: `/uploads/${file.filename}`,
            notes: [],
            highlights: []
        });

        user.books.push(newBook._id);
        await newBook.save();
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Book uploaded and parsed successfully",
            newBook,
        });

    } catch (error) {
        console.log("Error in newBook controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getAllBooks(req, res) {
    try {
        const userId = req.user._id

        const user = await User.findById(userId).select("-password")
            .populate({
                path: "books",
                options: { sort: { createdAt: -1 } }
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user.books)
    } catch (error) {
        console.log("Error in getAllBooks controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getBook(req, res) {
    try {
        const user = req.user;
        const { id: bookId } = req.params;

        const book = await Book.findById(bookId).select("-password").populate(
            { path: "notes", options: { sort: { createdAt: -1 } 
        }});
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        return res.status(200).json({ book });

    } catch (error) {
        console.log("Error in getBook controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function updateBook(req, res) {
    try {
        const user = req.user;
        const { id: bookId } = req.params;
        const { title, content } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        if (book.user.toString() !== user._id.toString()) {
            return res.status(403).json({ error: "You cannot update this book" });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;

        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            updateData,
            { new: true });

        if (!updatedBook) {
            return res.status(400).json({ error: "Book not found" });
        }

        return res.status(200).json({ success: true, updatedBook, user })

    } catch (error) {
        console.log("Error in updateBook controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function deleteBook(req, res) {
    try {
        const user = req.user;
        const { id: bookId } = req.params;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.user.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You cannot delete this book" });
        }

        user.books.pull(book._id);
        await user.save();
        await Book.findByIdAndDelete(bookId);

        return res.status(200).json({ success: true });

    } catch (error) {
        console.log("Error in deleteBook controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}