const mongoose=require("mongoose")

const FishSchema=new mongoose.Schema({
    name: { type: String, required: true },
    min_length: { type: Number, required: true, min: 0 }, 
    max_length: { type: Number, required: true, min: 0 },
    min_weight: { type: Number, required: true, min: 0 }, 
    max_weight: { type: Number, required: true, min: 0 },
    curfew: {
        start: { type: Date }, 
        end: { type: Date }
    }
})

module.exports=mongoose.model("FishModel", FishSchema, "fish")