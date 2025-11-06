import express from "express" 
import protectRoute from "../middleware/protectRoute.js";
import { newNote, getNotesByPage, highlightBook, getHighlights, editNote, moveNote, deleteNote } from "../controllers/note.controller.js"

const router = express.Router(); 

router.use(protectRoute);

router.post("/:bookId", newNote); 
router.post("/:bookId/highlights", highlightBook);
router.get("/:bookId/highlights", getHighlights);
router.get("/:bookId", getNotesByPage);
router.put("/:bookId/:id/edit", editNote);
router.put("/:bookId/:id/move", moveNote);
router.delete("/:bookId/:id", deleteNote);

export default router;