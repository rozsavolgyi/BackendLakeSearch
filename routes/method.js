const express=require('express')
const {getMethod, getMethodById} = require('../controllers/method')
const router = express.Router()

router.route('/').get(getMethod)
router.route('/:id').get(getMethodById)

module.exports=router