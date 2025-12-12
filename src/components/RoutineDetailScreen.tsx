import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { parseRoutineCSV, Routine } from '../utils/csvParser';
import { DayDetailScreen } from './DayDetailScreen';
import { theme } from '../theme/theme';
import { Calendar, ChevronRight, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { getRoutine, updateRoutine } from '../utils/storage';

interface RoutineDetailScreenProps {
    routineId: string;
    onBack: () => void;
}

export const RoutineDetailScreen: React.FC<RoutineDetailScreenProps> = ({ routineId, onBack }) => {
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [isOffline, setIsOffline] = useState(false);

    const convertToCsvUrl = (url: string): string | null => {
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) {
            return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
        }
        return null;
    };

    const loadRoutineData = async () => {
        setLoading(true);
        setError('');
        setIsOffline(false);

        try {
            const savedRoutine = await getRoutine(routineId);
            if (!savedRoutine) {
                throw new Error('Rutina no encontrada.');
            }

            const csvUrl = convertToCsvUrl(savedRoutine.url);
            if (!csvUrl) {
                throw new Error('El enlace no es válido.');
            }

            try {
                const response = await fetch(csvUrl);
                if (!response.ok) throw new Error('Network response was not ok');
                const text = await response.text();
                const data = parseRoutineCSV(text);
                setRoutine(data);

                // Update cache
                await updateRoutine({
                    ...savedRoutine,
                    lastKnownData: data
                });
            } catch (networkError) {
                console.log('Network error, trying cache', networkError);
                if (savedRoutine.lastKnownData) {
                    setRoutine(savedRoutine.lastKnownData);
                    setIsOffline(true);
                } else {
                    throw new Error('No se pudo cargar la rutina y no hay datos guardados.');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Error al cargar la rutina.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoutineData();
    }, [routineId]);

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
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <View>
                        <Text style={styles.title}>Tu Rutina</Text>
                        {isOffline && <Text style={styles.offlineText}>Estás sin internet</Text>}
                    </View>
                    <TouchableOpacity onPress={loadRoutineData} disabled={loading} style={styles.reloadButton}>
                        {loading ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : (
                            <RefreshCw size={20} color={theme.colors.primary} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {loading && !routine ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Cargando rutina...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.error}>{error}</Text>
                    <TouchableOpacity onPress={onBack} style={styles.retryButton}>
                        <Text style={styles.retryText}>Volver</Text>
                    </TouchableOpacity>
                </View>
            ) : (
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
                    ) : null}
                </ScrollView>
            )}
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
        padding: theme.spacing.l,
        paddingTop: theme.spacing.xl + 20,
        backgroundColor: theme.colors.surface,
        borderBottomLeftRadius: theme.borderRadius.l,
        borderBottomRightRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.m,
    },
    backButton: {
        marginRight: theme.spacing.m,
    },
    title: {
        ...theme.typography.h2,
    } as any,
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reloadButton: {
        padding: theme.spacing.s,
    },
    offlineText: {
        ...theme.typography.caption,
        color: theme.colors.warning,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...theme.typography.body,
        marginTop: theme.spacing.m,
        color: theme.colors.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.l,
    },
    error: {
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: theme.spacing.m,
        fontSize: 16,
    },
    retryButton: {
        padding: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
    },
    retryText: {
        color: theme.colors.text,
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
        backgroundColor: `${theme.colors.primary}20`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    dayText: {
        ...theme.typography.h3,
        flex: 1,
    } as any,
});
