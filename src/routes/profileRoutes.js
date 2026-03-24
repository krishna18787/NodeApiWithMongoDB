const express = require('express');
const { getProfile, uploadProfile } = require('../controllers/profileController');
const uploadProfileImage = require('../middleware/upload');

const router = express.Router();

router.get('/', getProfile);
router.post('/', uploadProfileImage.single('image'), uploadProfile);

module.exports = router;
