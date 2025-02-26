const MethodModel= require("../models/MethodModel")
const ErrorResponse=require("../utils/errorResponse")

exports.getMethod=async(req,res,next)=>{
    try {
        const method=await MethodModel.find(req.query)
        res.status(200).json({succes: true, count: method.length, data: method})
    } catch (error) {
        res.status(500).json({ success: false })
    }
}
