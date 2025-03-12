const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads"); 

// Ha nem létezik az 'uploads' mappa, akkor létrehozzuk
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Egyedi fájlnév
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB méretkorlát
});

module.exports = upload