const crypto = require('crypto')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')


// @desc   Register user
// @route  POST /auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body

        //Ellenőrizzük, hogy a felhasználó már regisztrálva van-e
        const existUser = await User.findOne({ email })
        if (existUser) {
            return next(new ErrorResponse('Az email cím már regisztrálva van!', 400))
        }
        // Ellenőrizzük hogy a jelszók egyeznek-e
        const confirmPassword = req.body.confirmPassword
        if (password !== confirmPassword) {
            return next(new ErrorResponse('A jelszavak nem egyeznek!', 400)) //nem biztzos, hogy jó
        }
        //Create user
        const user = await User.create({ name, email, password })

        sendTokenResponse(user, 200, res)
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message })
    }
}


// @desc   Login user
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // email és jelszó ellenőrzése
        if (!email || !password) {
            return next(
                new ErrorResponse(
                    'Kérem adjon meg egy email címet és egy jelszót!',
                    400
                )
            );
        }

        // A felhasználó megkeresése az adatbázisban
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorResponse('Érvénytelen email vagy jelszó!', 401));
        }

        // A jelszó megfelelőségének ellenőrzése
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Érvénytelen email vagy jelszó!', 401));
        }

        // Token generálása
        const token = user.getSignedJwtToken(); // Ez egy példa arra, hogyan generálhatsz tokent

        // Válasz küldése user és token információval
        res.status(200).json({
            success: true,
            user,    // Felhasználó adat
            token    // Az általad generált token
        });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
};
const sendTokenResponse = (user, statusCode, res) => {
    // Token létrehozása
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
        secure: false,
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    })
}