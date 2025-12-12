import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { Dumbbell, ChevronRight, Activity } from 'lucide-react-native';

interface HomeScreenProps {
    onNavigateToRoutine: () => void;
    onNavigateToStats: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToRoutine, onNavigateToStats }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <View style={styles.header}>
                <Text style={styles.title}>Fitness App</Text>
                <Text style={styles.subtitle}>Bienvenido de nuevo</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Menú Principal</Text>

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
});
