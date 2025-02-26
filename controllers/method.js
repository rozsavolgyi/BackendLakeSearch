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

exports.getMethodById=async(req, res, next)=>{
    try {
        const method=await MethodModel.findById(req.params.id)
        if (!method) {
            return res.status(400).json({succes: false, msg:"Not found"})
        }
        res.status(200).json({succes: true, data: method})
    } catch (error) {
        next(new ErrorResponse(`Method id (${req.params.id}) not correct`, 404
        ));
    }
}