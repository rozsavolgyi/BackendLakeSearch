const mongoose=require("mongoose")

const MethodSchema=new mongoose.Schema({
    name: String,
    description: String
})

module.exports=mongoose.model("MethodModel", MethodSchema, "method")
