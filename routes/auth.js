const express = require("express");
const { 
    register, 
    login,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/auth')

const router = express.Router();

const { protect } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.put('/updatedetails', protect,  updateDetails)
router.put('/updatepassword', protect,  updatePassword)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)

module.exports = router