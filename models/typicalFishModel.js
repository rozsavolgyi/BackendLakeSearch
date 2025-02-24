const mongoose = require("mongoose");
const typicalFishSchema=new mongoose.Schema({
    name:{
        type:String
    },
    img:{
        type:String,
        default: "no-photo.jpg"
    }
})

module.exports=mongoose.model("typicalFishModel", typicalFishSchema, "typical_fish")