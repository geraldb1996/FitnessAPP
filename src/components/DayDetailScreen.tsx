import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar } from 'react-native';
import { Exercise } from '../utils/csvParser';
import { theme } from '../theme/theme';
import { ArrowLeft, CheckCircle, Circle, Layers, Repeat, Clock, FileText } from 'lucide-react-native';

interface DayDetailScreenProps {
    day: string;
    exercises: Exercise[];
    onBack: () => void;
}

export const DayDetailScreen: React.FC<DayDetailScreenProps> = ({ day, exercises, onBack }) => {
    const [completedExercises, setCompletedExercises] = React.useState<Set<number>>(new Set());

    const toggleComplete = (index: number) => {
        const newCompleted = new Set(completedExercises);
        if (newCompleted.has(index)) {
            newCompleted.delete(index);
        } else {
            newCompleted.add(index);
        }
        setCompletedExercises(newCompleted);
    };

    const renderExercise = ({ item, index }: { item: Exercise; index: number }) => {
        const isCompleted = completedExercises.has(index);
        return (
            <View style={[styles.card, isCompleted && styles.cardCompleted]}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.exerciseName, isCompleted && styles.textCompleted]}>
                        {item.exercise}
                    </Text>
                    <TouchableOpacity onPress={() => toggleComplete(index)} style={styles.checkboxContainer}>
                        {isCompleted ? (
                            <CheckCircle size={28} color={theme.colors.success} fill={theme.colors.success} stroke="#FFF" />
                        ) : (
                            <Circle size={28} color={theme.colors.textSecondary} />
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <Layers size={16} color={theme.colors.primary} style={styles.icon} />
                        <Text style={styles.label}>Series:</Text>
                        <Text style={styles.value}>{item.sets}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Repeat size={16} color={theme.colors.primary} style={styles.icon} />
                        <Text style={styles.label}>Reps:</Text>
                        <Text style={styles.value}>{item.reps}</Text>
                    </View>

                    <View style={styles.detailItem}>
                        <Clock size={16} color={theme.colors.primary} style={styles.icon} />
                        <Text style={styles.label}>Descanso:</Text>
                        <Text style={styles.value}>{item.rest}</Text>
                    </View>
                </View>

                {item.notes ? (
                    <View style={styles.notesContainer}>
                        <View style={styles.notesHeader}>
                            <FileText size={16} color={theme.colors.secondary} style={styles.icon} />
                            <Text style={styles.label}>Notas:</Text>
                        </View>
                        <Text style={styles.notes}>{item.notes}</Text>
                    </View>
                ) : null}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{day}</Text>
                <View style={{ width: 24 }} /> {/* Spacer for centering */}
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
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.l,
        paddingTop: theme.spacing.xl + 20,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        padding: theme.spacing.s,
    },
    title: {
        ...theme.typography.h2,
    } as any,
    listContent: {
        padding: theme.spacing.l,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardCompleted: {
        borderColor: theme.colors.success,
        backgroundColor: `${theme.colors.success}10`, // 10% opacity
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.m,
    },
    exerciseName: {
        ...theme.typography.h3,
        flex: 1,
        marginRight: theme.spacing.m,
    } as any,
    textCompleted: {
        textDecorationLine: 'line-through',
        color: theme.colors.textSecondary,
    },
    checkboxContainer: {
        padding: 2,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.m,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.s,
        borderRadius: theme.borderRadius.s,
    },
    detailItem: {
        flex: 1,
        alignItems: 'center',
    },
    icon: {
        marginBottom: 4,
    },
    label: {
        ...theme.typography.caption,
        marginBottom: 2,
    },
    value: {
        ...theme.typography.body,
        fontWeight: 'bold',
    },
    notesContainer: {
        marginTop: theme.spacing.s,
        paddingTop: theme.spacing.s,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    notesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    notes: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
    },
});
