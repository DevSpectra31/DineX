const { searchFoodVideos, getPopularVideos } = require('../services/pexel.js');

const FOOD_QUERIES = [
  'indian food', 'italian food', 'japanese food',
  'street food', 'dessert', 'pizza', 'sushi',
  'biryani', 'burger', 'pasta'
];

// GET /api/explore/videos?query=biryani&page=1
exports.searchVideos = async (req, res) => {
  try {
    const query = req.query.query || 'food';
    const page  = parseInt(req.query.page) || 1;

    const data = await searchFoodVideos(query, page, 12);

    // Format response to match your reel structure
    const videos = data.videos.map(v => ({
      pexelsId:     v.id,
      title:        v.url.split('/').filter(Boolean).pop(), // slug as title
      videoUrl:     v.video_files.find(f => f.quality === 'hd')?.link || v.video_files[0].link,
      thumbnailUrl: v.image, // Pexels provides a preview image
      views:        0,
      likes:        [],
      saves:        [],
      comments:     [],
      uploadedBy:   { username: v.user.name, avatar: v.user.url },
      source:       'pexels',
      pexelsUrl:    v.url,
      duration:     v.duration,
    }));

    res.json({ success: true, videos, totalResults: data.total_results, page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/explore/popular
exports.getPopular = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await getPopularVideos(page, 12);

    const videos = data.videos.map(v => ({
      pexelsId:     v.id,
      title:        `Food video by ${v.user.name}`,
      videoUrl:     v.video_files.find(f => f.quality === 'hd')?.link || v.video_files[0].link,
      thumbnailUrl: v.image,
      views:        0,
      likes:        [],
      saves:        [],
      comments:     [],
      uploadedBy:   { username: v.user.name, avatar: '' },
      source:       'pexels',
      duration:     v.duration,
    }));

    res.json({ success: true, videos, page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/explore/categories
exports.getByCategory = async (req, res) => {
  try {
    const cuisine = req.query.cuisine || 'food';
    const page    = parseInt(req.query.page) || 1;

    // Map your cuisine filter to better Pexels search terms
    const queryMap = {
      Indian:        'indian food cooking',
      Italian:       'italian pasta pizza',
      Chinese:       'chinese food noodles',
      Mexican:       'mexican tacos food',
      American:      'american burger food',
      Japanese:      'japanese sushi ramen',
      Mediterranean: 'mediterranean food healthy',
      Other:         'street food recipe',
    };

    const query = queryMap[cuisine] || cuisine + ' food';
    const data  = await searchFoodVideos(query, page, 12);

    const videos = data.videos.map(v => ({
      pexelsId:     v.id,
      title:        `${cuisine} food`,
      videoUrl:     v.video_files.find(f => f.quality === 'hd')?.link || v.video_files[0].link,
      thumbnailUrl: v.image,
      views:        0,
      likes:        [],
      saves:        [],
      comments:     [],
      uploadedBy:   { username: v.user.name, avatar: '' },
      source:       'pexels',
      cuisine,
    }));

    res.json({ success: true, videos, page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};