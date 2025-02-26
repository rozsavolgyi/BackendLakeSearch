const mongoose=require("mongoose")

const FishSchema=new mongoose.Schema({
    name: String,
    min_length:Number,
    max_length:Number,
    min_weight:Number,
    max_weight:Number,
    curfew:{
        start:Date,
        end:Date
    }
})

module.exports=mongoose.model("FishModel", FishSchema, "fish")