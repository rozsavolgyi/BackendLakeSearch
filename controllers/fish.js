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
