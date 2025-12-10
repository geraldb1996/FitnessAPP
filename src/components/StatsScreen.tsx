import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, TextInput, Alert, Modal } from 'react-native';
import { theme } from '../theme/theme';
import { ArrowLeft, Plus, Activity, Trash2, ChevronRight } from 'lucide-react-native';
import { getStatCategories, saveStatCategory, deleteStatCategory, StatCategory } from '../utils/storage';

interface StatsScreenProps {
    onBack: () => void;
    onCategorySelect: (category: StatCategory) => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onBack, onCategorySelect }) => {
    const [categories, setCategories] = useState<StatCategory[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [newUnit, setNewUnit] = useState('');
    const [initialValue, setInitialValue] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const loaded = await getStatCategories();
        setCategories(loaded);
    };

    const handleAddCategory = async () => {
        if (!newName || !newUnit || !initialValue) {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }

        const value = parseFloat(initialValue);
        if (isNaN(value)) {
            Alert.alert('Error', 'El valor inicial debe ser un número.');
            return;
        }

        try {
            const newCategory: StatCategory = {
                id: Date.now().toString(),
                name: newName,
                unit: newUnit,
                entries: [
                    {
                        date: new Date().toISOString(),
                        value: value,
                    },
                ],
            };
            await saveStatCategory(newCategory);
            setNewName('');
            setNewUnit('');
            setInitialValue('');
            setIsModalVisible(false);
            loadCategories();
        } catch (error) {
            Alert.alert('Error', 'No se pudo crear la categoría.');
        }
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            'Eliminar Categoría',
            '¿Estás seguro? Se borrarán todos los datos.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteStatCategory(id);
                        loadCategories();
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Activity size={32} color={theme.colors.primary} />
                    <Text style={styles.title}>Mis Estadísticas</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
                    <Plus size={24} color="#FFF" />
                    <Text style={styles.addButtonText}>Agregar Nueva Categoría</Text>
                </TouchableOpacity>

                {categories.length === 0 ? (
                    <Text style={styles.emptyText}>No tienes estadísticas guardadas.</Text>
                ) : (
                    categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={styles.card}
                            onPress={() => onCategorySelect(category)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconContainer}>
                                <Activity size={24} color={theme.colors.primary} />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardTitle}>{category.name}</Text>
                                <Text style={styles.cardSubtitle}>
                                    Actual: {category.entries[category.entries.length - 1].value} {category.unit}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(category.id)}
                            >
                                <Trash2 size={20} color={theme.colors.error} />
                            </TouchableOpacity>
                            <ChevronRight size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nueva Categoría</Text>

                        <Text style={styles.label}>Nombre (ej. Peso Corporal)</Text>
                        <TextInput
                            style={styles.input}
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Nombre"
                            placeholderTextColor={theme.colors.textSecondary}
                        />

                        <Text style={styles.label}>Unidad (ej. kg, %)</Text>
                        <TextInput
                            style={styles.input}
                            value={newUnit}
                            onChangeText={setNewUnit}
                            placeholder="Unidad"
                            placeholderTextColor={theme.colors.textSecondary}
                        />

                        <Text style={styles.label}>Valor Inicial</Text>
                        <TextInput
                            style={styles.input}
                            value={initialValue}
                            onChangeText={setInitialValue}
                            placeholder="0.0"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleAddCategory}>
                                <Text style={styles.saveText}>Crear</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        ...theme.typography.h1,
        marginLeft: theme.spacing.s,
    } as any,
    content: {
        padding: theme.spacing.l,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.xl,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: theme.spacing.s,
    },
    emptyText: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.m,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.s,
        backgroundColor: `${theme.colors.primary}20`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        ...theme.typography.h3,
        marginBottom: 4,
    } as any,
    cardSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    deleteButton: {
        padding: theme.spacing.s,
        marginRight: theme.spacing.xs,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: theme.spacing.l,
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.l,
    },
    modalTitle: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.l,
        textAlign: 'center',
    } as any,
    label: {
        ...theme.typography.body,
        marginBottom: theme.spacing.xs,
        color: theme.colors.textSecondary,
    },
    input: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        borderRadius: theme.borderRadius.s,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: theme.spacing.m,
    },
    cancelButton: {
        padding: theme.spacing.m,
        marginRight: theme.spacing.s,
    },
    cancelText: {
        color: theme.colors.textSecondary,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.s,
        paddingHorizontal: theme.spacing.l,
        borderRadius: theme.borderRadius.s,
    },
    saveText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});
