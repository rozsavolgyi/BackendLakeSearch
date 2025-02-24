const express=require('express')
const{
    getTypicalFish,
    getTypicalFishById
}=require('../controllers/typicalFish')
const router=express.Router()

router.get('/',getTypicalFish)
router.get('/:id', getTypicalFishById)

module.exports=router