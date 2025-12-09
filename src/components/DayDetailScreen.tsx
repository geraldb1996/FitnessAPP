import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Exercise } from '../utils/csvParser';

interface DayDetailScreenProps {
    day: string;
    exercises: Exercise[];
    onBack: () => void;
}

export const DayDetailScreen: React.FC<DayDetailScreenProps> = ({ day, exercises, onBack }) => {
    const renderExercise = ({ item }: { item: Exercise }) => (
        <View style={styles.card}>
            <Text style={styles.exerciseName}>{item.exercise}</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Series:</Text>
                <Text style={styles.value}>{item.sets}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Repeticiones:</Text>
                <Text style={styles.value}>{item.reps}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Descanso:</Text>
                <Text style={styles.value}>{item.rest}</Text>
            </View>

            {item.notes ? (
                <View style={styles.notesContainer}>
                    <Text style={styles.label}>Notas:</Text>
                    <Text style={styles.notes}>{item.notes}</Text>
                </View>
            ) : null}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button title="< Rutina" onPress={onBack} />
                <Text style={styles.title}>{day}</Text>
                <View style={{ width: 60 }} /> {/* Spacer for centering */}
            </View>

            <FlatList
                data={exercises}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderExercise}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        fontWeight: '600',
        marginRight: 5,
        color: '#555',
    },
    value: {
        color: '#333',
        flex: 1,
    },
    notesContainer: {
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 5,
    },
    notes: {
        fontStyle: 'italic',
        color: '#666',
    },
});
