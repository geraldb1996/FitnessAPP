import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

interface MainScreenProps {
    onRoutinePress: (url: string) => void;
}

export const MainScreen: React.FC<MainScreenProps> = ({ onRoutinePress }) => {
    const [url, setUrl] = useState('');
    const [isInputVisible, setIsInputVisible] = useState(false);

    const handleSaveLink = () => {
        if (!url) {
            Alert.alert('Error', 'Por favor ingresa un enlace válido');
            return;
        }
        setIsInputVisible(false);
        Alert.alert('Éxito', 'Enlace guardado temporalmente');
    };

    const handleRoutinePress = () => {
        if (!url) {
            Alert.alert('Atención', 'Primero debes agregar el enlace de la hoja de cálculo');
            return;
        }
        onRoutinePress(url);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fitness App</Text>

            {!isInputVisible ? (
                <Button
                    title={url ? "Cambiar Link" : "Ingresar Link de Hoja de Cálculo"}
                    onPress={() => setIsInputVisible(true)}
                />
            ) : (
                <View style={styles.inputContainer}>
                    <Text>Pega el enlace aquí:</Text>
                    <TextInput
                        style={styles.input}
                        value={url}
                        onChangeText={setUrl}
                        placeholder="https://docs.google.com/spreadsheets/..."
                        autoCapitalize="none"
                    />
                    <Button title="Guardar Link" onPress={handleSaveLink} />
                </View>
            )}

            <View style={styles.spacer} />

            <Button
                title="Rutina"
                onPress={handleRoutinePress}
                disabled={!url && !isInputVisible} // Optional: disable if no url
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
    },
    spacer: {
        height: 20,
    },
});
