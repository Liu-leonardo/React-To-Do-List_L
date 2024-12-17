import React from 'react';
import { View, StyleSheet } from 'react-native';
import TDListUi from './TDListUi';

export default function TodoListScreen() {
  return (
    <View style={styles.container}>
      <TDListUi />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
