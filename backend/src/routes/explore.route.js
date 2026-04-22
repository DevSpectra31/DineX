const express = require('express');
const router  = express.Router();
const { searchVideos, getPopular, getByCategory } = require('../controllers/explore.controller');

router.get('/videos',     searchVideos);   // ?query=biryani&page=1
router.get('/popular',    getPopular);     // ?page=1
router.get('/categories', getByCategory); // ?cuisine=Indian&page=1

module.exports = router;