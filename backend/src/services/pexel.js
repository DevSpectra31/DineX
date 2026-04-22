const axios = require('axios');

const PEXELS_BASE = 'https://api.pexels.com/videos';

const pexelsClient = axios.create({
  baseURL: PEXELS_BASE,
  headers: { Authorization: process.env.PEXELS_API_KEY },
});

// Search food videos
exports.searchFoodVideos = async (query = 'food', page = 1, perPage = 10) => {
  const res = await pexelsClient.get('/search', {
    params: { query, page, per_page: perPage, orientation: 'portrait' },
  });
  return res.data;
};

// Get a single video
exports.getVideoById = async (id) => {
  const res = await pexelsClient.get(`/videos/${id}`);
  return res.data;
};

// Get curated/popular food videos
exports.getPopularVideos = async (page = 1, perPage = 10) => {
  const res = await pexelsClient.get('/popular', {
    params: { page, per_page: perPage },
  });
  return res.data;
};