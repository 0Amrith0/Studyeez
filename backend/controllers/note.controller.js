import Note from "../models/Note.model.js";
import Book from "../models/Book.model.js";


export async function newNote(req, res) {
    try {
        const userId = req.user._id;
        const { bookId } = req.params;
        const { content, } = req.body;
        const { pageNumber, x, y } = req.query;

        const book = await Book.findById(bookId);
        if (!book || book.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Cannot add note to this book" });
        }

        const note = new Note({
            content,
            book: bookId,
            position: { x: Number(x) || 100, y: Number(y) || 100 },
            pageNumber: parseInt(pageNumber),
        });

        book.notes.push(note._id);

        await note.save();
        await book.save();

        res.status(201).json(note);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function highlightBook(req, res) {
    try {
        const { pageNumber, x, y, width, height, color } = req.body;
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        book.highlights.push({ pageNumber, x, y, width, height, color });

        await book.save();
        res.json(book.highlights);

    } catch (error) {
        res.status(500).json({ error: "Failed to save highlight" });
    }
};

export async function getHighlights(req, res) {
    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) return res.status(404).json({ error: "Book not found" });

        res.json(book.highlights);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch highlights" });
    }
};

export async function getNotesByPage(req, res) {
    try {
        const userId = req.user._id;
        const { bookId } = req.params;
        const { pageNumber } = req.query;

        const book = await Book.findById(bookId);
        if (!book || book.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Cannot access notes for this book" });
        }

        const notes = await Note.find({ book: bookId, pageNumber })
            .sort({ createdAt: 1 });

        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function editNote(req, res) {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const { content } = req.body;

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ error: "Note not found" });

        const book = await Book.findById(note.book);
        if (!book || book.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Not authorized to edit this note" });
        }

        if (content !== undefined) note.content = content;

        await note.save();
        res.status(200).json(note);
    } catch (error) {
        console.error("Error updating note content:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function moveNote(req, res) {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const { x, y } = req.query;

        const note = await Note.findById(id);
        if (!note) return res.status(404).json({ error: "Note not found" });

        const book = await Book.findById(note.book);
        if (!book || book.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Not authorized to move this note" });
        }

        if (x === undefined || y === undefined) {
            return res.status(400).json({ error: "Missing position coordinates" });
        }

        note.position = { x: Number(x), y: Number(y) };
        await note.save();

        res.status(200).json(note);
    } catch (error) {
        console.error("Error updating note position:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteNote(req, res) {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const note = await Note.findById(id);
        const book = await Book.findById(note.book);

        if (!note || book.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Cannot find or delete the note" });
        }

        await Note.findByIdAndDelete(id);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
