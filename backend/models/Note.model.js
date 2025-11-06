import mongoose from "mongoose"


const notesSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },
    content: {
        type: String,
        required: true
    },
    position: {
        x: Number,
        y: Number
    },
    pageNumber: Number,
},
    { timestamps: true });

const Note = mongoose.model("Note", notesSchema)

export default Note;