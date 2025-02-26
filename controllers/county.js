const CountyModel = require("../models/CountyModel");
const ErrorResponse = require("../utils/errorResponse");

exports.getCounty = async (req, res, next) => {
    try {
        const county = await CountyModel.find(req.query).populate({path: 'lake'})
        res.status(200).json({ success: true, count: county.length, data: county })
    } catch (error) {
        res.status(500).json({ success: false })
    }
};

exports.getCountyById = async (req, res, next) => {
    try {
        const county = await CountyModel.findById(req.params.id).populate({
            path:'lake'
        })
        if (!county) {
            return res.status(400).json({ success: false, msg: "Not found" });
        }
        res.status(200).json({ success: true, data: county });
    } catch (error) {
        next(new ErrorResponse(`County id (${req.params.id}) not correct`, 404
        ));
    }
}