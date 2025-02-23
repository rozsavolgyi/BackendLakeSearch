const crypto = require('crypto')
const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')


// @desc   Register user
// @route  POST /auth/register
exports.register = async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body
  
      //Ellenőrizzük, hogy a felhasználó már regisztrálva van-e
      const existUser=await User.findOne({email})
      if (existUser) {
        return next(new ErrorResponse('Az email cím már regisztrálva van!', 400))
      }
      // Ellenőrizzük hogy a jelszók egyeznek-e
      const confirmPassword = req.body.confirmPassword
      if (password !== confirmPassword) {
        return next(new ErrorResponse('A jelszavak nem egyeznek!', 400)) //nem biztzos, hogy jó
      }
      //Create user
      const user = await User.create({ name, email, password })
  
      sendTokenResponse(user, 200, res)
    } catch (error) {
      res.status(400).json({ success: false, msg: error.message })
    }
  }