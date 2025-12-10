import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine } from './csvParser';

export interface SavedRoutine {
    id: string;
    name: string;
    url: string;
    lastKnownData?: Routine;
}

const ROUTINES_KEY = '@fitness_app_routines';

export const saveRoutine = async (routine: SavedRoutine): Promise<void> => {
    try {
        const existingRoutines = await getRoutines();
        const newRoutines = [...existingRoutines, routine];
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(newRoutines));
    } catch (e) {
        console.error('Error saving routine', e);
        throw e;
    }
};

export const getRoutines = async (): Promise<SavedRoutine[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(ROUTINES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error reading routines', e);
        return [];
    }
};

export const getRoutine = async (id: string): Promise<SavedRoutine | undefined> => {
    try {
        const routines = await getRoutines();
        return routines.find(r => r.id === id);
    } catch (e) {
        console.error('Error getting routine', e);
        return undefined;
    }
};

export const deleteRoutine = async (id: string): Promise<void> => {
    try {
        const existingRoutines = await getRoutines();
        const newRoutines = existingRoutines.filter(r => r.id !== id);
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(newRoutines));
    } catch (e) {
        console.error('Error deleting routine', e);
        throw e;
    }
};

export const updateRoutine = async (updatedRoutine: SavedRoutine): Promise<void> => {
    try {
        const existingRoutines = await getRoutines();
        const newRoutines = existingRoutines.map(r =>
            r.id === updatedRoutine.id ? updatedRoutine : r
        );
        await AsyncStorage.setItem(ROUTINES_KEY, JSON.stringify(newRoutines));
    } catch (e) {
        console.error('Error updating routine', e);
        throw e;
    }
};
