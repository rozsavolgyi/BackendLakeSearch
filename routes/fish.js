const express=require('express')
const {getFish, getFisById}=require('../controllers/fish')
const router = express.Router();
router.route('/').get(getFish);
router.route('/:id').get(getFisById);

module.exports = router;