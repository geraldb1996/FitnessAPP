import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { HomeScreen } from './src/components/HomeScreen';
import { RoutineScreen } from './src/components/RoutineScreen';
import { RoutineDetailScreen } from './src/components/RoutineDetailScreen';
import { StatsScreen } from './src/components/StatsScreen';
import { StatDetailScreen } from './src/components/StatDetailScreen';
import { theme } from './src/theme/theme';
import { StatCategory } from './src/utils/storage';

type Screen = 'Home' | 'RoutineManager' | 'RoutineDetail' | 'StatsManager' | 'StatDetail';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StatCategory | null>(null);

  const handleNavigateToRoutine = (id: string) => {
    setSelectedRoutineId(id);
    setCurrentScreen('RoutineDetail');
  };

  const handleNavigateToStatDetail = (category: StatCategory) => {
    setSelectedCategory(category);
    setCurrentScreen('StatDetail');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return (
          <HomeScreen
            onNavigateToRoutine={() => setCurrentScreen('RoutineManager')}
            onNavigateToStats={() => setCurrentScreen('StatsManager')}
          />
        );
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
      case 'StatsManager':
        return (
          <StatsScreen
            onBack={() => setCurrentScreen('Home')}
            onCategorySelect={handleNavigateToStatDetail}
          />
        );
      case 'StatDetail':
        if (!selectedCategory) return null;
        return (
          <StatDetailScreen
            category={selectedCategory}
            onBack={() => setCurrentScreen('StatsManager')}
            onUpdate={() => {
              // Force re-render or handle update if needed, 
              // but for now StatsScreen re-fetches on mount.
              // Ideally we'd refresh the selectedCategory here.
              // For simplicity, we can just go back or rely on local state updates if we passed a refresh function.
              // Let's just keep it simple.
            }}
          />
        );
      default:
        return <HomeScreen onNavigateToRoutine={() => setCurrentScreen('RoutineManager')} onNavigateToStats={() => setCurrentScreen('StatsManager')} />;
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
