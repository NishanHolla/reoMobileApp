import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import Avatar from './Avatar';
import { Session } from '@supabase/supabase-js';
import { getProfile, updateProfile, signOut } from './Auth';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  async function fetchProfile() {
    setLoading(true);
    const data = await getProfile(session);
    if (data) {
      setUsername(data.username);
      setWebsite(data.website);
      setAvatarUrl(data.avatar_url);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View>
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile(session, { username, website, avatar_url: url });
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          mode="contained"
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile(session, { username, website, avatar_url: avatarUrl })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </Button>
      </View>

      <View style={styles.verticallySpaced}>
        <Button mode="contained" title="Sign Out" onPress={signOut} disabled={loading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
