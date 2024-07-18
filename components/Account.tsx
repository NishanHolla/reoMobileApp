import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, TextInput, Avatar } from 'react-native-paper';
import { Session } from '@supabase/supabase-js';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      let { data, error, status } = await supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={200}
          source={{ uri: avatarUrl || 'https://via.placeholder.com/200' }}
        />
        <Button
          mode="contained"
          onPress={() => {
            // Implement avatar upload logic here
            const url = 'new_avatar_url'; // Replace with actual upload logic
            setAvatarUrl(url);
            updateProfile({ username, website, avatar_url: url });
          }}
        >
          Upload Avatar
        </Button>
      </View>
      <TextInput
        label="Email"
        value={session?.user?.email}
        disabled
        style={styles.input}
      />
      <TextInput
        label="Username"
        value={username || ''}
        onChangeText={(text) => setUsername(text)}
        style={styles.input}
      />
      <TextInput
        label="Website"
        value={website || ''}
        onChangeText={(text) => setWebsite(text)}
        style={styles.input}
      />

      <Button
        mode="contained"
        loading={loading}
        onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
        disabled={loading}
        style={styles.button}
      >
        {loading ? 'Loading ...' : 'Update'}
      </Button>

      <Button mode="contained" onPress={() => supabase.auth.signOut()} style={styles.button}>
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});