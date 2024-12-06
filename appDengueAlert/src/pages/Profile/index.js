import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../config/firebaseconfig';
import styles from './style';

export default function UserProfile({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userID = await AsyncStorage.getItem('userID');
                console.log("ID do usuário recuperado:", userID); 

                if (userID) {
                    const userDocRef = doc(database, 'AppUsers', userID);
                    const userSnapshot = await getDoc(userDocRef);

                    if (userSnapshot.exists()) {
                        console.log("Dados do usuário:", userSnapshot.data()); 
                        setUserData(userSnapshot.data());
                    } else {
                        console.log('Usuário não encontrado no Firestore.');
                    }
                } else {
                    console.log('ID do usuário não encontrado no AsyncStorage.');
                }
            } catch (error) {
                console.error("Erro ao recuperar dados do usuário:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Usuário não encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Perfil do Usuário</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={userData.name}
                    editable={false}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nome de Usuário"
                    value={userData.user}
                    editable={false}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={userData.email}
                    editable={false}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('User')}>
                    <Text style={styles.buttonText}>Sair</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
