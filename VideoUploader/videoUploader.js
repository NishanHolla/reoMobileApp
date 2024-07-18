const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config(); // Load environment variables from .env file

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to upload all videos from a folder
const uploadAllVideos = async () => {
  const folderPath = './videosFolder'; // Replace with your actual folder path
  try {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileBuffer = fs.readFileSync(filePath); // Read file into buffer
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(`videos/${file}`, fileBuffer, {
          cacheControl: '3600',
          upsert: false,
        });
      if (error) {
        console.error(`Error uploading ${file}:`, error.message);
      } else {
        console.log(`File ${file} uploaded successfully:`, data);
      }
    }
    console.log('Uploads completed');
  } catch (error) {
    console.error('Error uploading videos:', error.message);
  }
};

uploadAllVideos();
