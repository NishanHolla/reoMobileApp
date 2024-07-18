import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { FileSystem } from 'react-native-fs';
import { supabase } from '../utils/supabase';

const VideoPlayerScreen = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase.storage.from('videos').list('videos');
      if (error) {
        throw error;
      }
      const videoList = data.map(video => ({
        name: video.name,
      }));
      setVideos(videoList);
      console.log(videoList);
    } catch (error) {
      console.error('Error fetching videos:', error.message);
    }
  };

  const downloadAndPlayVideo = async (videoName) => {
    try {
      const { data, error } = await supabase.storage
        .from('videos/videos')
        .download(videoName);
      if (error) {
        throw error;
      }

      const docDir = await FileSystem.DocumentDirectoryPath;
      const filePath = `${docDir}/${videoName}`;

      // Write downloaded data to temporary file
      await FileSystem.writeFile(filePath, data);

      // Create a temporary URL for the downloaded video
      const videoUri = await FileSystem.uriForFilePath(filePath);
      setSelectedVideo(videoUri);
    } catch (error) {
      console.error('Error downloading video:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Video Player</Text>
      {selectedVideo && (
        <Video
          source={{ uri: selectedVideo }}
          style={styles.video}
          controls={true}
          resizeMode="contain"
        />
      )}
      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => downloadAndPlayVideo(item.name)}>
            <Text style={styles.videoItem}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name}
        ListEmptyComponent={<Text>No videos found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 300,
    backgroundColor: 'black',
  },
  videoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
});

export default VideoPlayerScreen;
