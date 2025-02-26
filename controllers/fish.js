const { query } = require("express")
const FishModel=require("../models/FishModel")
const ErrorResponse=require("../utils/errorResponse")

exports.getFish=async(req, res, next)=>{
    try {
        const fish=await FishModel.find(req.query)
        res.status(200).json({success: true, count: fish.length, data: fish})
    } catch (error) {
        res.status(500).json({ success: false })
    }
}
exports.getFisById = async (req, res, next) => {
    try {
        const fish = await FishModel.findById(req.params.id)
        if (!fish) {
            return res.status(400).json({ success: false, msg: "Not found" });
        }
        res.status(200).json({ success: true, data: fish });
    } catch (error) {
        next(new ErrorResponse(`Fish id (${req.params.id}) not correct`, 404
        ));
    }
}