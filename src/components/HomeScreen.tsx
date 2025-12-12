import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Modal, Linking } from 'react-native';
import { theme } from '../theme/theme';
import { Dumbbell, ChevronRight, Activity, FilePlus, X } from 'lucide-react-native';

interface HomeScreenProps {
    onNavigateToRoutine: () => void;
    onNavigateToStats: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToRoutine, onNavigateToStats }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const openTemplate = () => {
        Linking.openURL('https://docs.google.com/spreadsheets/d/1Kqf4nJDMJQMHJRDhwJlu0A9KCsK2q2mLgA98FznBN2w/copy?usp=sharing');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <View style={styles.header}>
                <Text style={styles.title}>FITO</Text>
                <Text style={styles.subtitle}>Fit in Online</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} style={styles.scrollView}>
                <Text style={styles.sectionTitle}>Opciones</Text>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={onNavigateToRoutine}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <Dumbbell size={32} color={theme.colors.primary} />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuTitle}>Rutinas Semanales</Text>
                        <Text style={styles.menuSubtitle}>Administra rutinas agregadas desde GoogleSheets</Text>
                    </View>
                    <ChevronRight size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={onNavigateToStats}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <Activity size={32} color={theme.colors.primary} />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuTitle}>Mis Estadísticas</Text>
                        <Text style={styles.menuSubtitle}>Para checar tu progreso</Text>
                    </View>
                    <ChevronRight size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => setIsModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <FilePlus size={32} color={theme.colors.primary} />
                    </View>
                    <View style={styles.menuTextContainer}>
                        <Text style={styles.menuTitle}>Crea tu propia rutina</Text>
                        <Text style={styles.menuSubtitle}>Instrucciones y plantilla</Text>
                    </View>
                    <ChevronRight size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Developed by GeraldGlitch</Text>
            </View>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Crea tu propia rutina</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <X size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.instructionsContainer}>
                            <Text style={styles.instructionItem}>1. Presiona "Plantilla" para abrir el documento.</Text>
                            <Text style={styles.instructionItem}>2. Crea una copia en tu Google Drive.</Text>
                            <Text style={styles.instructionItem}>3. Edita la hoja con tus ejercicios.</Text>
                            <Text style={styles.instructionItem}>4. Copia el enlace de la hoja (asegúrate que sea público/visible).</Text>
                            <Text style={styles.instructionItem}>5. Ve a "Rutinas Semanales" y agrega el enlace.</Text>
                        </View>

                        <TouchableOpacity style={styles.templateButton} onPress={openTemplate}>
                            <Text style={styles.templateButtonText}>Plantilla</Text>
                        </TouchableOpacity>
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
        marginBottom: theme.spacing.xl,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    title: {
        ...theme.typography.h1,
        marginLeft: theme.spacing.s,
    } as any,
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
    content: {
        padding: theme.spacing.l,
    },
    sectionTitle: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.m,
    } as any,
    menuItem: {
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
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        ...theme.typography.h3,
        marginBottom: 4,
    } as any,
    menuSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
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
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.l,
    },
    modalTitle: {
        ...theme.typography.h2,
    } as any,
    instructionsContainer: {
        marginBottom: theme.spacing.xl,
    },
    instructionItem: {
        ...theme.typography.body,
        marginBottom: theme.spacing.s,
        color: theme.colors.text,
    },
    templateButton: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    templateButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    footer: {
        padding: theme.spacing.m,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
    },
    footerText: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
});
