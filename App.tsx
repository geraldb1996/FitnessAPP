import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
import { MainScreen } from './src/components/MainScreen';
import { RoutineScreen } from './src/components/RoutineScreen';
import { DayDetailScreen } from './src/components/DayDetailScreen';
import { parseRoutineCSV, Routine } from './src/utils/csvParser';

type Screen = 'Main' | 'Routine' | 'DayDetail';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Main');
  const [sheetUrl, setSheetUrl] = useState('');
  const [routineData, setRoutineData] = useState<Routine | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const convertToCsvUrl = (url: string): string | null => {
    // Extract Spreadsheet ID
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
    }
    return null;
  };

  const handleGetRoutine = async (url: string) => {
    setSheetUrl(url);
    const csvUrl = convertToCsvUrl(url);

    if (!csvUrl) {
      Alert.alert('Error', 'El enlace no parece ser una hoja de cálculo de Google válida.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error('No se pudo descargar la hoja de cálculo. Asegúrate de que sea pública.');
      }
      const text = await response.text();
      const parsedRoutine = parseRoutineCSV(text);

      if (Object.keys(parsedRoutine).length === 0) {
        Alert.alert('Aviso', 'No se encontraron datos válidos en la hoja. Verifica el formato de las columnas.');
      } else {
        setRoutineData(parsedRoutine);
        setCurrentScreen('Routine');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Ocurrió un error al obtener la rutina.');
    } finally {
      setLoading(false);
    }
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setCurrentScreen('DayDetail');
  };

  const handleBackToRoutine = () => {
    setSelectedDay(null);
    setCurrentScreen('Routine');
  };

  const handleBackToMain = () => {
    setRoutineData(null);
    setCurrentScreen('Main');
  };

  const renderScreen = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    switch (currentScreen) {
      case 'Main':
        return <MainScreen onRoutinePress={handleGetRoutine} />;
      case 'Routine':
        return (
          <RoutineScreen
            routine={routineData || {}}
            onDaySelect={handleDaySelect}
            onBack={handleBackToMain}
          />
        );
      case 'DayDetail':
        return (
          <DayDetailScreen
            day={selectedDay || ''}
            exercises={selectedDay && routineData ? routineData[selectedDay] : []}
            onBack={handleBackToRoutine}
          />
        );
      default:
        return <MainScreen onRoutinePress={handleGetRoutine} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
