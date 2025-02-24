const typicalFishModel=require("../models/typicalFishModel")
const ErrorResponse=require("../utils/errorResponse")

exports.getTypicalFish=async(req,res,next)=>{
    try {
        const typicalFish = await typicalFishModel.find(req.query)
        res.status(200).json({succes:true, count: typicalFish.length, data: typicalFish})
    } catch (error) {
        res.status(500).json({succes:false})
    }
}