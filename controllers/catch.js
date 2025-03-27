const Catch = require("../models/CatchModel");
const Fish = require("../models/FishModel");
const Lake = require("../models/TavakModel");
const Method = require("../models/MethodModel");
const User = require("../models/User");
const fs = require('fs');
const ErrorResponse = require("../utils/errorResponse");

exports.getCatch = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.lakeId) {
      query.lake = req.query.lakeId; //Szűrés tó szerint
    }
    const catchs = await Catch.find(query)
      .populate("fish", "name img") // Csak a szükséges mezőket töltjük be
      .populate("lake", "name")
      .populate("user", "name")
      .populate("method", "name");
    res.status(200).json({ success: true, count: catchs.length, data: catchs });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Hiba történt a fogások lekérésekor",
        error,
      });
  }
};

exports.getCatchById = async (req, res, next) => {
  try {
    const catchs = await Catch.findById(req.params.id)
      .populate({ path: "fish" })
      .populate({ path: "lake" })
      .populate({ path: "method" })
      .populate({ path: "user" });
    if (!catchs) {
      return res.status(400).json({ success: false, message: "Nem található" });
    }
    res.status(200).json({ success: true, data: catchs });
  } catch (error) {
    next(new ErrorResponse(`Catch id (${req.params.id}) not correct`, 404));
  }
};

exports.createCatch = async (req, res) => {
  try {
    const { fish, weight, length, date, method, lake, user, bait, description, catchandrelease } = req.body;
    const isCatchAndRelease = catchandrelease === 'true';

    if (!fish || !weight || !length || !date || !method || !lake || !user || !bait || !description) {
      return res.status(400).json({ message: "Minden kötelező mezőt ki kell tölteni!" });
    }

    const isMeaningfulText = (text) => /^[A-Za-zÁ-űáéíóöőúüű0-9\s.,!?()'"-]{5,}$/u.test(text) && !/(.)\1{4,}/.test(text) && (text.match(/[aeiouáéíóöőúüű]/gi) || []).length >= 2;
    if (!isMeaningfulText(description) || description.length > 500) {
      return res.status(400).json({ message: "A leírás nem megfelelő!" });
    }
    if (!isMeaningfulText(bait)) {
      return res.status(400).json({ message: "A csali megnevezés nem megfelelő!" });
    }

    const fishExists = await Fish.findById(fish);
    if (!fishExists) {
      return res.status(400).json({ message: "Érvénytelen hal azonosító!" });
    }

    if (!isCatchAndRelease) {
      if (weight < fishExists.min_weight || weight > fishExists.max_weight) {
        return res.status(400).json({ message: `A hal súlya ${fishExists.min_weight}-${fishExists.max_weight} kg között lehet!` });
      }
      if (length < fishExists.min_length || length > fishExists.max_length) {
        return res.status(400).json({ message: `A hal hossza ${fishExists.min_length}-${fishExists.max_length} cm között lehet!` });
      }
      if (fishExists.curfew?.start && fishExists.curfew?.end) {
        const catchMonthDay = date.split('-').slice(1).join('-');
        if (isDateBetween(catchMonthDay, fishExists.curfew.start, fishExists.curfew.end)) {
          return res.status(400).json({ message: "Ebben az időszakban a hal nem fogható!" });
        }
      }
    }

    const newCatch = new Catch({
      fish, weight, length, date, method, lake, user, bait, description,
      img: req.file ? `http://localhost:3000/uploads/${req.file.filename}` : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP-OEry7CChvfqglcuIYjclKu7b0NEcMeegg&s",
      catchandrelease: isCatchAndRelease
    });

    const savedCatch = await newCatch.save();
    res.status(201).json({ message: "Fogás sikeresen létrehozva", data: savedCatch });
  } catch (error) {
    console.error("Hiba a createCatch-ben:", error);
    res.status(400).json({ message: "Hiba történt a fogás létrehozásakor", error: error.message });
  }
};

function isDateBetween(monthDay, start, end) {
  const [month, day] = monthDay.split('-').map(Number);
  const [startMonth, startDay] = start.split('-').map(Number);
  const [endMonth, endDay] = end.split('-').map(Number);

  const checkDate = new Date(2000, month - 1, day);
  const startDate = new Date(2000, startMonth - 1, startDay);
  const endDate = new Date(2000, endMonth - 1, endDay);

  return startDate <= endDate ? (checkDate >= startDate && checkDate <= endDate) : (checkDate >= startDate || checkDate <= endDate);
}

exports.deleteCatch = async (req, res) => {
  try {
    // Fogás lekérése az adatbázisból
    const catchItem = await Catch.findById(req.params.id);
    if (!catchItem) {
      return res.status(404).json({ message: "Fogás nem található" });
    }

    // Ellenőrizzük, hogy a kép nem az alapértelmezett-e
    const isDefaultImage = catchItem.img === "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP-OEry7CChvfqglcuIYjclKu7b0NEcMeegg&s";

    if (!isDefaultImage) {
      // Fájl törlése az uploads mappából
      const filePath = catchItem.img.replace('http://localhost:3000/uploads/', './uploads/');
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Hiba a fájl törlésekor:', err);
        } else {
          console.log(`Fájl sikeresen törölve: ${filePath}`);
        }
      });
    }

    // Fogás törlése az adatbázisból
    await Catch.findByIdAndDelete(req.params.id);

    // Válasz visszaadása a kliensnek
    res.status(200).json({ message: "Fogás és a hozzá tartozó fájl sikeresen törölve", deletedCatch: catchItem });
  } catch (error) {
    // Hibakezelés
    console.error("Hiba történt a fogás törlésekor:", error);
    res.status(500).json({ message: "Hiba történt a fogás törlésekor", error });
  }
};

exports.updateCatch = async (req, res) => {
  try {
    const {
      fish,
      weight,
      length,
      date,
      method,
      lake,
      user,
      bait,
      img,
      description,
    } = req.body;

    // Ellenőrizzük, hogy a kötelező mezők ki vannak-e töltve
    if (
      !fish ||
      !weight ||
      !length ||
      !date ||
      !method ||
      !lake ||
      !user ||
      !bait ||
      !description
    ) {
      return res
        .status(400)
        .json({ message: "Minden kötelező mezőt ki kell tölteni!" });
    }

    // Ellenőrizzük, hogy a leírás nem hosszabb, mint 500 karakter
    if (description.length > 500) {
      return res
        .status(400)
        .json({ message: "A leírás legfeljebb 500 karakter lehet!" });
    }

    // Ellenőrizzük, hogy léteznek-e a hivatkozott objektumok
    const fishExists = await Fish.findById(fish);
    const methodExists = await Method.findById(method);
    const lakeExists = await Lake.findById(lake);
    const userExists = await User.findById(user);

    if (!fishExists || !methodExists || !lakeExists || !userExists) {
      return res.status(400).json({ message: "Érvénytelen azonosítók!" });
    }

    // Megkeressük a fogást, amit frissíteni szeretnénk
    const catchItem = await Catch.findById(req.params.id);
    if (!catchItem) {
      return res.status(404).json({ message: "Fogás nem található" });
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

    res
      .status(200)
      .json({
        success: true,
        data: updatedCatch,
        message: "Fogás sikeresen frissítve",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Hiba történt a fogás frissítésekor", error });
  }
};
exports.getCatchByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId; // A userId paraméter

    // Fogások lekérése a userId alapján
    const catchs = await Catch.find({ user: userId })
      .populate("fish", "name img") // Csak a szükséges mezők betöltése
      .populate("lake", "name")
      .populate("method", "name")
      .populate("user", "name");

    if (!catchs) {
      return res
        .status(500)
        .json({ success: false, message: "Hiba a fogások lekérésekor" });
    }

    if (catchs.length === 0) {
      return res.status(200).json({ success: true, data: [] }); // Visszatérés üres tömbbel, nem hiba!
    }
    res.status(200).json({ success: true, data: catchs });
  } catch (error) {
    console.error("Hiba történt a fogások lekérésekor:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Hiba történt a fogások lekérésekor",
        error,
      });
  }
};
