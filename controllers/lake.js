const { query } = require("express");
const tavakModel = require("../models/TavakModel");
const ErrorResponse = require("../utils/errorResponse");
const TavakModel = require("../models/TavakModel");

exports.getTavak = async (req, res, next) => {
    try {
        const {countyId, page=1,limit=10}=req.query
        const filter = {};
        if (countyId) {
            filter.county = countyId;  // Megye szerinti szűrés
        }
        const startIndex = (page - 1) * limit
        const tavak = await tavakModel.find(filter).skip(startIndex).limit(parseInt(limit)).populate({path: 'typical_fish.fish', select: '-_id'})
        const totalLakes=await TavakModel.countDocuments(filter)
        res.status(200).json({ data: tavak, total:totalLakes, currentPage:parseInt(page),totalPages:Math.ceil(totalLakes/limit)})
    } catch (error) {
        res.status(500).json({ success: false })
    }
};

exports.getToById = async (req, res, next) => {
    try {
        const to = await tavakModel.findById(req.params.id).populate({
            path:'typical_fish.fish',
            select:'-_id'
        })
        if (!to) {
            return res.status(400).json({ success: false, msg: "Not found" });
        }
        res.status(200).json({ success: true, data: to });
    } catch (error) {
        next(new ErrorResponse(`Lake id (${req.params.id}) not correct`, 404));
    }
};