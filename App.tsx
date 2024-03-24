// App.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import TrainList from './components/TrainList';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <TrainList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
