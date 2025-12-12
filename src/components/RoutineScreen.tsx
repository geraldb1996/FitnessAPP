import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { Dumbbell, Plus, Trash2, ChevronRight, ArrowLeft, Save, Edit2 } from 'lucide-react-native';
import { saveRoutine, getRoutines, deleteRoutine, updateRoutine, SavedRoutine } from '../utils/storage';

interface RoutineScreenProps {
    onBack: () => void;
    onRoutineSelect: (url: string) => void;
}

export const RoutineScreen: React.FC<RoutineScreenProps> = ({ onBack, onRoutineSelect }) => {
    const [routines, setRoutines] = useState<SavedRoutine[]>([]);
    const [newUrl, setNewUrl] = useState('');
    const [newName, setNewName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        loadRoutines();
    }, []);

    const loadRoutines = async () => {
        const loaded = await getRoutines();
        setRoutines(loaded);
    };

    const handleSave = async () => {
        if (!newUrl || !newName) {
            Alert.alert('Error', 'Por favor ingresa un nombre y un enlace.');
            return;
        }

        try {
            if (editingId) {
                const updatedRoutine: SavedRoutine = {
                    id: editingId,
                    name: newName,
                    url: newUrl,
                };
                await updateRoutine(updatedRoutine);
                setEditingId(null);
            } else {
                const newRoutine: SavedRoutine = {
                    id: Date.now().toString(),
                    name: newName,
                    url: newUrl,
                };
                await saveRoutine(newRoutine);
            }
            setNewUrl('');
            setNewName('');
            setIsAdding(false);
            loadRoutines();
        } catch (error) {
            Alert.alert('Error', 'No se pudo guardar la rutina.');
        }
    };

    const handleEdit = (routine: SavedRoutine) => {
        setNewName(routine.name);
        setNewUrl(routine.url);
        setEditingId(routine.id);
        setIsAdding(true);
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            'Eliminar Rutina',
            '¿Estás seguro de eliminar esta rutina?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteRoutine(id);
                        loadRoutines();
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
                    <Dumbbell size={32} color={theme.colors.primary} />
                    <Text style={styles.title}>Mis Rutinas</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {isAdding ? (
                    <View style={styles.addCard}>
                        <Text style={styles.addTitle}>{editingId ? 'Editar Rutina' : 'Nueva Rutina'}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la rutina (ej. Rutina de Juanito)"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newName}
                            onChangeText={setNewName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Link de Google Sheets"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={newUrl}
                            onChangeText={setNewUrl}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <View style={styles.addButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => {
                                    setIsAdding(false);
                                    setEditingId(null);
                                    setNewName('');
                                    setNewUrl('');
                                }}
                            >
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Save size={20} color="#FFF" style={{ marginRight: 8 }} />
                                <Text style={styles.saveText}>{editingId ? 'Actualizar' : 'Guardar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
                        <Plus size={24} color="#FFF" />
                        <Text style={styles.addButtonText}>Agregar Nueva Rutina</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.sectionTitle}>Rutinas Guardadas</Text>

                {routines.length === 0 ? (
                    <Text style={styles.emptyText}>No tienes rutinas guardadas.</Text>
                ) : (
                    routines.map((routine) => (
                        <TouchableOpacity
                            key={routine.id}
                            style={styles.routineCard}
                            onPress={() => onRoutineSelect(routine.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.routineIcon}>
                                <Dumbbell size={24} color={theme.colors.primary} />
                            </View>
                            <View style={styles.routineInfo}>
                                <Text style={styles.routineName}>{routine.name}</Text>
                                <Text style={styles.routineUrl} numberOfLines={1}>{routine.url}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => handleEdit(routine)}
                            >
                                <Edit2 size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDelete(routine.id)}
                            >
                                <Trash2 size={20} color={theme.colors.error} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
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
    addCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    addTitle: {
        ...theme.typography.h3,
        marginBottom: theme.spacing.m,
    } as any,
    input: {
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        borderRadius: theme.borderRadius.s,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    addButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        padding: theme.spacing.m,
        marginRight: theme.spacing.s,
    },
    cancelText: {
        color: theme.colors.textSecondary,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.s,
        paddingHorizontal: theme.spacing.m,
        borderRadius: theme.borderRadius.s,
    },
    saveText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    sectionTitle: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.m,
    } as any,
    emptyText: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.m,
    },
    routineCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    routineIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.s,
        backgroundColor: `${theme.colors.primary}20`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    routineInfo: {
        flex: 1,
    },
    routineName: {
        ...theme.typography.h3,
        marginBottom: 4,
    } as any,
    routineUrl: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
    },
    editButton: {
        padding: theme.spacing.s,
        marginRight: theme.spacing.xs,
    },
    deleteButton: {
        padding: theme.spacing.s,
    },
});
