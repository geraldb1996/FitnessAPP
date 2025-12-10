import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { HomeScreen } from './src/components/HomeScreen';
import { RoutineScreen } from './src/components/RoutineScreen';
import { RoutineDetailScreen } from './src/components/RoutineDetailScreen';
import { theme } from './src/theme/theme';

type Screen = 'Home' | 'RoutineManager' | 'RoutineDetail';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);

  const handleNavigateToRoutine = (id: string) => {
    setSelectedRoutineId(id);
    setCurrentScreen('RoutineDetail');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen onNavigateToRoutine={() => setCurrentScreen('RoutineManager')} />;
      case 'RoutineManager':
        return (
          <RoutineScreen
            onBack={() => setCurrentScreen('Home')}
            onRoutineSelect={handleNavigateToRoutine}
          />
        );
      case 'RoutineDetail':
        return (
          <RoutineDetailScreen
            routineId={selectedRoutineId || ''}
            onBack={() => setCurrentScreen('RoutineManager')}
          />
        );
      default:
        return <HomeScreen onNavigateToRoutine={() => setCurrentScreen('RoutineManager')} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      {renderScreen()}
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
