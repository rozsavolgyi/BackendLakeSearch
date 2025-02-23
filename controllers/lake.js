const tavakModel = require("../models/TavakModel");
const ErrorResponse = require("../utils/errorResponse");

exports.getTavak = async (req, res, next) => {
    try {
        const tavak = await tavakModel.find(req.query)
        res.status(200).json({ success: true, count: tavak.length, data: tavak })
    } catch (error) {
        res.status(500).json({ success: false })
    }
};

