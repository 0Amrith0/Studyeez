import express from "express"
import multer from "multer";
import protectRoute from "../middleware/protectRoute.js";
import { newBook, getAllBooks, getBook, updateBook, deleteBook } from "../controllers/book.controller.js"
import path from "path";


const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, "uploads/"),
        filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage: storage });


const router = express.Router();

router.use(protectRoute);

router.post("/", upload.single("file"), newBook);
router.get("/", getAllBooks);
router.get("/:id", getBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook)


export default router;