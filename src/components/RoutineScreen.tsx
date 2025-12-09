import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { parseRoutineCSV, Routine } from '../utils/csvParser';
import { DayDetailScreen } from './DayDetailScreen';
import { theme } from '../theme/theme';
import { Dumbbell, Calendar, ChevronRight, Download } from 'lucide-react-native';

export const RoutineScreen = () => {
    const [url, setUrl] = useState('');
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    const handleFetch = async () => {
        setLoading(true);
        setError('');
        try {


            const response = await fetch(url);
            const text = await response.text();
            const data = parseRoutineCSV(text);
            setRoutine(data);
        } catch (err) {
            setError('Error al cargar la rutina. Verifica el link.');
        } finally {
            setLoading(false);
        }
    };

    if (selectedDay && routine) {
        return (
            <DayDetailScreen
                day={selectedDay}
                exercises={routine[selectedDay]}
                onBack={() => setSelectedDay(null)}
            />
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Dumbbell size={32} color={theme.colors.primary} />
                    <Text style={styles.title}>Fitness App</Text>
                </View>
                <Text style={styles.subtitle}>Tu plan de entrenamiento</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Pega el link de Google Sheets aquí"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={url}
                    onChangeText={setUrl}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleFetch}
                    disabled={loading || !url}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <View style={styles.buttonContent}>
                            <Download size={20} color="#FFF" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Cargar Rutina</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>

            <ScrollView contentContainerStyle={styles.listContent}>
                {routine ? (
                    Object.keys(routine).map((day) => (
                        <TouchableOpacity
                            key={day}
                            style={styles.dayCard}
                            onPress={() => setSelectedDay(day)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.dayIconContainer}>
                                <Calendar size={24} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.dayText}>{day}</Text>
                            <ChevronRight size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            Ingresa un link para ver tu rutina
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.l,
        paddingTop: theme.spacing.xl + 20, // Status bar padding
        backgroundColor: theme.colors.surface,
        borderBottomLeftRadius: theme.borderRadius.l,
        borderBottomRightRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.m,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    title: {
        ...theme.typography.h1,
        marginLeft: theme.spacing.s,
    } as any, // Cast to any to avoid fontWeight issue for now, or fix theme type
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
    inputContainer: {
        paddingHorizontal: theme.spacing.l,
        marginBottom: theme.spacing.l,
    },
    input: {
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        fontSize: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.m,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    error: {
        color: theme.colors.error,
        marginTop: theme.spacing.s,
        textAlign: 'center',
    },
    listContent: {
        paddingHorizontal: theme.spacing.l,
        paddingBottom: theme.spacing.xl,
    },
    dayCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    dayIconContainer: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.s,
        backgroundColor: `${theme.colors.primary}20`, // 20% opacity
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    dayText: {
        ...theme.typography.h3,
        flex: 1,
    } as any,
    emptyState: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
    },
    emptyStateText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
