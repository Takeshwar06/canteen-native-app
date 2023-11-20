import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Coin = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>Main Content</Text>
      </View>
      <View style={styles.bottomBar}>
        <Text>Fixed at the Bottom</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 10,
  },
});

export default Coin;
