import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { RoutineScreen } from './src/components/RoutineScreen';
import { theme } from './src/theme/theme';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <RoutineScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default App;
