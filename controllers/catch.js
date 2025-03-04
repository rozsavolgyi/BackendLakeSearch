const Catch = require("../models/CatchModel");
const Fish = require("../models/FishModel");
const Lake = require("../models/TavakModel");
const Method = require("../models/MethodModel");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");


exports.getCatch = async (req, res, next) => {
    try {
        const catchs = await Catch.find(req.query).populate({ path: 'fish' }).populate({ path: 'lake' }).populate({ path: 'method' }).populate({ path: 'user' })
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