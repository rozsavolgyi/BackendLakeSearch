const express = require('express')
const{
    getTavak,
    getToById
}=require('../controllers/lake')
const router = express.Router()

router.get('/', getTavak)
router.get('/:id', getToById)

module.exports = router