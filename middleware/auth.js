const jwt = require('jsonwebtoken')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User.js')

// Útvonalak védelme
exports.protect = async (req, res, next) => {
    try {
        let token 

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // A token beállítása a Bearer tokennel a fejlécben
            token = req.headers.authorization.split(' ')[1]
        }
        

        // A token létezésének ellenőrzése
        if (!token) {
            return next(new ErrorResponse('Nincs engedélyed ehhez az útvonalhoz', 401))
        }

        // A token tartalmának ellenőrzése
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        console.log(decoded);

        req.user = await User.findById(decoded.id)

        next()
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
}