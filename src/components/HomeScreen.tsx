import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { theme } from '../theme/theme';
import { Dumbbell, ChevronRight } from 'lucide-react-native';

interface HomeScreenProps {
    onNavigateToRoutine: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToRoutine }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Dumbbell size={32} color={theme.colors.primary} />
                    <Text style={styles.title}>Fitness App</Text>
                </View>
                <Text style={styles.subtitle}>Bienvenido a tu entrenador personal</Text>
            </View>

            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={onNavigateToRoutine}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <Dumbbell size={24} color={theme.colors.primary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.menuTitle}>Rutina</Text>
                        <Text style={styles.menuSubtitle}>Carga y visualiza tu plan de entrenamiento</Text>
                    </View>
                    <ChevronRight size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                {/* Placeholder for future options */}
                {/* 
                <TouchableOpacity style={styles.menuItem}>
                    ...
                </TouchableOpacity> 
                */}
            </View>
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
    menuContainer: {
        paddingHorizontal: theme.spacing.l,
    },
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
    textContainer: {
        flex: 1,
    },
    menuTitle: {
        ...theme.typography.h3,
        marginBottom: 4,
    } as any,
    menuSubtitle: {
        ...theme.typography.caption,
    },
});
