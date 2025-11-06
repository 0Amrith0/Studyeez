import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note",
        }
    ],
    highlights: [{
        pageNumber: Number,
        x: Number,
        y: Number,
        width: Number,
        height: Number,
        color: { type: String, default: "#FFFF00" }
    }]
},

    { timestamps: true })

const Book = mongoose.model("Book", bookSchema)

export default Book;