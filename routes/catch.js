const express = require("express");
const {
    getCatch,
    getCatchById,
    createCatch,
    deleteCatch,
    updateCatch,
    getCatchByUserId
} =require("../controllers/catch")

const router = express.Router();
const upload= require("../middleware/upload")


router.get("/", getCatch);
router.get("/:id", getCatchById);
router.post("/", createCatch);
router.delete("/:id", deleteCatch);
router.put('/:id', updateCatch);
router.get("/user/:userId", getCatchByUserId);
router.post("/create",upload.single("img"),createCatch)
module.exports = router;