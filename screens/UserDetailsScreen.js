import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Session } from '@supabase/supabase-js';

export default function UserDetailsScreen({ session }: { session: Session }) {
  return (
    <View style={styles.container}>
      <Text>User Details Screen</Text>
      <Text>Email: {session.user.email}</Text>
      {/* Add more user details here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
