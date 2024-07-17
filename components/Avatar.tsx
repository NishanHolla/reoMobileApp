import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Image, TouchableOpacity } from 'react-native';
import DocumentPicker, { isCancel, isInProgress, types } from 'react-native-document-picker';
import { supabase } from '../utils/supabase';

interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) throw error;

      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setAvatarUrl(fr.result as string);
      };
    } catch (error) {
      console.log('Error downloading image: ', error.message);
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      const fileExt = file[0].name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      let { error } = await supabase.storage.from('avatars').upload(filePath, {
        uri: file[0].uri,
        type: file[0].type,
        name: file[0].name,
      });

      if (error) throw error;

      onUpload(filePath);
    } catch (error) {
      if (isCancel(error)) {
        console.warn('cancelled');
      } else if (isInProgress(error)) {
        console.warn('multiple pickers were opened, only the last will be considered');
      } else if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <View>
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} accessibilityLabel="Avatar" style={[avatarSize, styles.avatar, styles.image]} />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <TouchableOpacity style={styles.button} onPress={uploadAvatar} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Uploading ...' : 'Upload'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    resizeMode: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'blue', // Adjust color as needed
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
