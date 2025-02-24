const mongoose = require("mongoose");

const CountySchema = new mongoose.Schema({
  name: String,
  lake: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "TavakModel" // A TavakModel modellre történő hivatkozás
  }]
});

module.exports = mongoose.model("CountyModel", CountySchema, "county");