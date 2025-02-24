const express = require('express');
const { getCounty, getCountyById } = require('../controllers/county');
const router = express.Router();

router.route('/').get(getCounty);
router.route('/:id').get(getCountyById);

module.exports = router;