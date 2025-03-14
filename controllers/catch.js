const Catch = require("../models/CatchModel");
const Fish = require("../models/FishModel");
const Lake = require("../models/TavakModel");
const Method = require("../models/MethodModel");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");


exports.getCatch = async (req, res, next) => {
    try {
        let query = {};
        if (req.query.lakeId) {
            query.lake = req.query.lakeId;//Szűrés tó szerint
        }
        const catchs = await Catch.find(query)
            .populate('fish', 'name img')  // Csak a szükséges mezőket töltjük be
            .populate('lake', 'name')
            .populate('user', 'name')
            .populate('method', 'name');
        res.status(200).json({ success: true, count: catchs.length, data: catchs })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Hiba történt a fogások lekérésekor', error })
    }
}

exports.getCatchById = async (req, res, next) => {
    try {
        const catchs = await Catch.findById(req.params.id).populate({ path: 'fish' }).populate({ path: 'lake' }).populate({ path: 'method' }).populate({ path: 'user' })
        if (!catchs) {
            return res.status(400).json({ success: false, message: 'Nem található' })
        }
        res.status(200).json({ success: true, data: catchs })
    } catch (error) {
        next(new ErrorResponse(`Catch id (${req.params.id}) not correct`, 404));
    }
}

exports.createCatch = async (req, res) => {
    try {
        console.log("Feltöltött fájl:", req.file);
        console.log("Request body:", req.body);
        const { fish, weight, length, date, method, lake, user, bait, description } = req.body;
        if (!fish || !weight || !length || !date || !method || !lake || !user || !bait || !description) {
            return res.status(400).json({ message: 'Minden kötelező mezőt ki kell tölteni!' });
        }

        if (description.length > 500) {
            return res.status(400).json({ message: 'A leírás legfeljebb 500 karakter lehet!' });
        }

        const fishExists = await Fish.findById(fish);
        const methodExists = await Method.findById(method);
        const lakeExists = await Lake.findById(lake);
        const userExists = await User.findById(user);

        if (!fishExists || !methodExists || !lakeExists || !userExists) {
            return res.status(400).json({ message: 'Érvénytelen azonosítók!' });
        }

        const imageUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP-OEry7CChvfqglcuIYjclKu7b0NEcMeegg&s";

        const newCatch = new Catch({
            fish,
            weight,
            length,
            date,
            method,
            lake,
            user,
            bait,
            description,
            img: imageUrl
        });

        const savedCatch = await newCatch.save();
        res.status(201).json({ message: 'Fogás sikeresen létrehozva', data: savedCatch });
    } catch (error) {
        console.error("Hiba a createCatch-ben:", error);
        res.status(400).json({ message: 'Hiba történt a fogás létrehozásakor', error: error.message });
    }
};

exports.deleteCatch = async (req, res) => {
    try {
        const catchItem = await Catch.findById(req.params.id);
        if (!catchItem) {
            return res.status(404).json({ message: 'Fogás nem található' });
        }

        await Catch.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Fogás sikeresen törölve', deletedCatch: catchItem });
    } catch (error) {
        res.status(500).json({ message: 'Hiba történt a fogás törlésekor', error });
    }
};

exports.updateCatch = async (req, res) => {
    try {
        const { fish, weight, length, date, method, lake, user, bait, img, description } = req.body;

        // Ellenőrizzük, hogy a kötelező mezők ki vannak-e töltve
        if (!fish || !weight || !length || !date || !method || !lake || !user || !bait || !description) {
            return res.status(400).json({ message: 'Minden kötelező mezőt ki kell tölteni!' });
        }

        // Ellenőrizzük, hogy a leírás nem hosszabb, mint 500 karakter
        if (description.length > 500) {
            return res.status(400).json({ message: 'A leírás legfeljebb 500 karakter lehet!' });
        }

        // Ellenőrizzük, hogy léteznek-e a hivatkozott objektumok
        const fishExists = await Fish.findById(fish);
        const methodExists = await Method.findById(method);
        const lakeExists = await Lake.findById(lake);
        const userExists = await User.findById(user);

        if (!fishExists || !methodExists || !lakeExists || !userExists) {
            return res.status(400).json({ message: 'Érvénytelen azonosítók!' });
        }

        // Megkeressük a fogást, amit frissíteni szeretnénk
        const catchItem = await Catch.findById(req.params.id);
        if (!catchItem) {
            return res.status(404).json({ message: 'Fogás nem található' });
        }

        // Frissítjük a fogást
        catchItem.fish = fish;
        catchItem.weight = weight;
        catchItem.length = length;
        catchItem.date = date;
        catchItem.method = method;
        catchItem.lake = lake;
        catchItem.user = user;
        catchItem.bait = bait;
        catchItem.description = description;
        catchItem.img = img || catchItem.img; // Ha nincs új kép, megtartjuk a régit

        // Mentjük el a frissített fogást
        const updatedCatch = await catchItem.save();

        res.status(200).json({ success: true, data: updatedCatch, message: 'Fogás sikeresen frissítve' });
    } catch (error) {
        res.status(500).json({ message: 'Hiba történt a fogás frissítésekor', error });
    }
};
exports.getCatchByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;  // A userId paraméter

        // Fogások lekérése a userId alapján
        const catchs = await Catch.find({ user: userId })
            .populate('fish', 'name img')  // Csak a szükséges mezők betöltése
            .populate('lake', 'name')
            .populate('method', 'name')
            .populate('user', 'name');

        if (!catchs || catchs.length === 0) {
            return res.status(404).json({ success: false, message: 'Nincs fogás a felhasználóhoz rendelve.' });
        }

        res.status(200).json({ success: true, data: catchs });
    } catch (error) {
        console.error('Hiba történt a fogások lekérésekor:', error);
        res.status(500).json({ success: false, message: 'Hiba történt a fogások lekérésekor', error });
    }
};