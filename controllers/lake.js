const tavakModel = require("../models/TavakModel");
const ErrorResponse = require("../utils/errorResponse");

exports.getTavak = async (req, res, next) => {
    try {
        const tavak = await tavakModel.find(req.query).populate("typical_fish.fish")
        res.status(200).json({ success: true, count: tavak.length, data: tavak })
    } catch (error) {
        res.status(500).json({ success: false })
    }
};

exports.getToById = async (req, res, next) => {
    try {
        const to = await tavakModel.findById(req.params.id).populate({
            path:'typical_fish.fish'
        })
        if (!to) {
            return res.status(400).json({ success: false, msg: "Not found" });
        }
        res.status(200).json({ success: true, data: to });
    } catch (error) {
        next(new ErrorResponse(`Lake id (${req.params.id}) not correct`, 404));
    }
};