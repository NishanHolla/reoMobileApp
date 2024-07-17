import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import VideoPlayerScreen from '../components/VideoPlayerScreen';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <VideoPlayerScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
