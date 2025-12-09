import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { HomeScreen } from './src/components/HomeScreen';
import { RoutineScreen } from './src/components/RoutineScreen';
import { theme } from './src/theme/theme';

type Screen = 'Home' | 'Routine';

const App = () => {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('Home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      {currentScreen === 'Home' ? (
        <HomeScreen onNavigateToRoutine={() => setCurrentScreen('Routine')} />
      ) : (
        <RoutineScreen onBack={() => setCurrentScreen('Home')} />
      )}
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
