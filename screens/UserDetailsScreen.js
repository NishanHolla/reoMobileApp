import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button, ActivityIndicator } from 'react-native-paper';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';

interface UserProfile {
  username: string;
  avatar_url: string;
}

export default function UserDetailsScreen({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>User Details Screen</Text>
      <Text>Email: {session.user.email}</Text>
      {profile && (
        <>
          <Text>Username: {profile.username}</Text>
          {profile.avatar_url && (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.avatar}
            />
          )}
        </>
      )}
      <Button
        mode="contained"
        onPress={handleSignOut}
        style={styles.signOutButton}
      >
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
  signOutButton: {
    marginTop: 20,
  },
});
