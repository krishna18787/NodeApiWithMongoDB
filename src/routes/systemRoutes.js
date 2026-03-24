const express = require('express');
const {
  echo,
  health,
  hello,
} = require('../controllers/systemController');

const router = express.Router();

router.get('/hello', hello);
router.post('/echo', echo);
router.get('/health', health);

module.exports = router;
