import { Alert } from 'react-native';
import { supabase } from '../utils/supabase';

export async function getProfile(session) {
  try {
    if (!session?.user) throw new Error('No user on the session!');

    let { data, error, status } = await supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', session?.user.id)
      .single();
    if (error && status !== 406) {
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  }
}

export async function updateProfile(session, { username, website, avatar_url }) {
  try {
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
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  }
}
