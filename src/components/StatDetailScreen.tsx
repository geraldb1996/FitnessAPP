import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, TextInput, Alert, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '../theme/theme';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { addStatEntry, StatCategory } from '../utils/storage';

interface StatDetailScreenProps {
    category: StatCategory;
    onBack: () => void;
    onUpdate: () => void;
}

export const StatDetailScreen: React.FC<StatDetailScreenProps> = ({ category, onBack, onUpdate }) => {
    const [currentCategory, setCurrentCategory] = useState<StatCategory>(category);
    const [newValue, setNewValue] = useState('');

    const handleAddEntry = async () => {
        const value = parseFloat(newValue);
        if (isNaN(value)) {
            Alert.alert('Error', 'El valor debe ser un número.');
            return;
        }

        const newEntry = {
            date: new Date().toISOString(),
            value: value,
        };

        try {
            await addStatEntry(currentCategory.id, newEntry);

            // Update local state immediately
            const updatedCategory = {
                ...currentCategory,
                entries: [...currentCategory.entries, newEntry]
            };
            setCurrentCategory(updatedCategory);

            setNewValue('');
            onUpdate(); // Refresh parent data
        } catch (error) {
            Alert.alert('Error', 'No se pudo agregar el registro.');
        }
    };

    // Prepare chart data
    const chartData = {
        labels: currentCategory.entries.slice(-6).map(e => {
            const date = new Date(e.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        }),
        datasets: [
            {
                data: currentCategory.entries.slice(-6).map(e => e.value),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>{currentCategory.name}</Text>
                    <Text style={styles.subtitle}>Historial de progreso</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.chartContainer}>
                    <LineChart
                        data={chartData}
                        width={Dimensions.get('window').width - theme.spacing.l * 2}
                        height={220}
                        chartConfig={{
                            backgroundColor: theme.colors.surface,
                            backgroundGradientFrom: theme.colors.surface,
                            backgroundGradientTo: theme.colors.surface,
                            decimalPlaces: 1,
                            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(161, 161, 170, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: theme.colors.primary,
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Nuevo Registro ({currentCategory.unit})</Text>
                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            value={newValue}
                            onChangeText={setNewValue}
                            placeholder="0.0"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleAddEntry}>
                            <Plus size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.historyTitle}>Historial</Text>
                {currentCategory.entries.slice().reverse().map((entry, index) => (
                    <View key={index} style={styles.historyItem}>
                        <Text style={styles.historyDate}>
                            {new Date(entry.date).toLocaleDateString()} {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        <Text style={styles.historyValue}>
                            {entry.value} {currentCategory.unit}
                        </Text>
                    </View>
                ))}
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
        paddingTop: theme.spacing.xl + 20,
        backgroundColor: theme.colors.surface,
        borderBottomLeftRadius: theme.borderRadius.l,
        borderBottomRightRadius: theme.borderRadius.l,
        marginBottom: theme.spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: theme.spacing.m,
    },
    title: {
        ...theme.typography.h2,
    } as any,
    subtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    content: {
        padding: theme.spacing.l,
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    inputContainer: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    inputLabel: {
        ...theme.typography.h3,
        marginBottom: theme.spacing.m,
    } as any,
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        borderRadius: theme.borderRadius.s,
        padding: theme.spacing.m,
        marginRight: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
        fontSize: 18,
    },
    addButton: {
        backgroundColor: theme.colors.primary,
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.s,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyTitle: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.m,
    } as any,
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    historyDate: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
    historyValue: {
        ...theme.typography.body,
        fontWeight: 'bold',
    } as any,
});
