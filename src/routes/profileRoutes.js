const express = require('express');
const {
  getProfile,
  getProfileHistory,
  uploadProfile,
} = require('../controllers/profileController');
const uploadProfileImage = require('../middleware/upload');

const router = express.Router();

router.get('/history', getProfileHistory);
router.get('/', getProfile);
router.post('/', uploadProfileImage.single('image'), uploadProfile);

module.exports = router;
