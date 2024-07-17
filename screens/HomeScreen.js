import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';

export default function HomeScreen({ session }: { session: Session }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button mode="contained" onPress={() => navigation.navigate('User Details')}>
        Go to User Details
      </Button>
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
