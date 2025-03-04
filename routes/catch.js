const express = require("express");
const {
    getCatch,
    getCatchById,
    createCatch,
    deleteCatch,
    updateCatch
} =require("../controllers/catch")

const router = express.Router();

router.get("/", getCatch);
router.get("/:id", getCatchById);
router.post("/", createCatch);
router.delete("/:id", deleteCatch);
router.put('/:id', updateCatch);

module.exports = router;