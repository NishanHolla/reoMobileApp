const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    const folderPath = 'videos/videos'; // Path to the folder containing the videos
    const { data: videos, error } = await supabase.storage.from('videos').list('videos');
    if (error) {
      throw error;
    }

    const videoUrls = videos.map(video => ({
      name: video.name,
      url: supabase.storage.from('videos/videos').getPublicUrl(`${video.name}`).publicURL,
    }));

    console.log('Videos:', videoUrls);
  } catch (error) {
    console.error('Error fetching videos:', error.message);
  } finally {
    process.exit();
  }
})();
