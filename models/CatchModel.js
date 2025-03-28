const mongoose = require('mongoose');

const catchSchema = new mongoose.Schema({
    fish:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FishModel',
        required: true
    },
    img:{
        type:String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP-OEry7CChvfqglcuIYjclKu7b0NEcMeegg&s'
    },
    weight: {
        type: Number,
        required: true
    },
    length: {
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required:true,
        default : Date.now
    },
    method:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MethodModel',
        required:true
    },
    bait:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
        maxlength: 500
    },
    lake: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TavakModel',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    catchandrelease:{
        type: Boolean,
        default:false
    }
}, {timestamps: true});

module.exports = mongoose.model('CatchModel', catchSchema, 'catch');

