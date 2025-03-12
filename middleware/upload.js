const fs = require("fs"); // <-- Itt importáljuk az fs modult
const multer = require("multer");
const path = require("path");

// Ellenőrizzük, hogy az "uploads" mappa létezik-e, ha nem, létrehozzuk
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Fájl tárolási konfiguráció
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Csak képeket engedélyezünk
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const isValidType = allowedTypes.test(file.mimetype);
    const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (isValidType && isValidExt) {
        cb(null, true);
    } else {
        cb(new Error("Csak JPG, JPEG vagy PNG formátum engedélyezett!"));
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB méretkorlát
    fileFilter: fileFilter
});

module.exports = upload;