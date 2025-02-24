const mongoose = require("mongoose");
const ToSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "Please add a name"],
    // unique: true,
    // trim: true,
    // maxlength: [50, "Name can not be more than 50 characters!"],
  },
  img: {
    type: String,
    default: "no-photo.jpg",
  },
  location: {
    type: String
  },
  coordinates: {
    type: [Number]
  },
  description: {
    type: String
  },
  typical_fish: [{
    fish: {
      _id: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: "typicalFishModel"
    }
  }],
  water_depth: {
    type: String
  },
  steg_number: {
    type: String
  },
  day_ticket: {
    type: [String],
    type: {
      type: String,
      enum: [
        "felnőtt",
        "gyermek",
        "éjszakai",
        "diák",
        "családi"
      ]
    },
    price: {
      type: Number
    }
  },
  opening_hours: [
    {
      day: {
        type: String
      },
      open: {
        type: String
      },
      close: {
        type: String
      }
    }
  ]
},
)


module.exports = mongoose.model("TavakModel", ToSchema, "lake");