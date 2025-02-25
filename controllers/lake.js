const { query } = require("express");
const tavakModel = require("../models/TavakModel");
const ErrorResponse = require("../utils/errorResponse");

exports.getTavak = async (req, res, next) => {
    const page = parseInt(req.query.page) || 2;
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = (page - 1) * limit;
    const endIndex=page*limit;
    const total = await tavakModel.countDocuments();
    const pagination = {};
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    query=query.skip(startIndex).limit(limit);
    try {
        const tavak = await tavakModel.find(req.query).skip(startIndex).limit(limit).populate({path: 'typical_fish.fish', select: '-_id'})
        res.status(200).json({ success: true, count: tavak.length, pagination, data: tavak })
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