const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false   //Amikor lekérünk egy felhasználót az API-tól
                        //nem fogja visszaadni a jelszót
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})