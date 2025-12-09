import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { Routine } from '../utils/csvParser';

interface RoutineScreenProps {
    routine: Routine;
    onDaySelect: (day: string) => void;
    onBack: () => void;
}

export const RoutineScreen: React.FC<RoutineScreenProps> = ({ routine, onDaySelect, onBack }) => {
    const days = Object.keys(routine);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tu Rutina</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {days.length === 0 ? (
                    <Text style={styles.emptyText}>No se encontraron días en la rutina.</Text>
                ) : (
                    days.map((day) => (
                        <View key={day} style={styles.buttonContainer}>
                            <Button title={day} onPress={() => onDaySelect(day)} />
                        </View>
                    ))
                )}
            </ScrollView>
            <View style={styles.footer}>
                <Button title="Volver al Inicio" onPress={onBack} color="#666" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    buttonContainer: {
        marginBottom: 15,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
    footer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
});
