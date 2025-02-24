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
exports.getTypicalFishById = async (req, res, next) => {
    try {
        const typicalFish = await typicalFishModel.findById(req.params.id)
        if (!typicalFish) {
            return res.status(400).json({ success: false, msg: "Not found" });
        }
        res.status(200).json({ success: true, data: typicalFish });
    } catch (error) {
        next(new ErrorResponse(`Lake id (${req.params.id}) not correct`, 404));
    }
};