import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Alert, TouchableOpacity, Image } from "react-native";
import { database } from "../../config/firebaseconfig"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import LogoDengueAlert from '../../images/LogoDengueAlert.png';
import styles from "./style";

export default function User() {
    const navigation = useNavigation();
    const [identifier, setIdentifier] = useState(""); 
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); 

    const handleLogin = async () => {
        try {
            const userQuery = query(
                collection(database, "AppUsers"), 
                where("user", "==", identifier)
            );

            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                const userData = userDoc.data();

                if (userData.password === password) {
                    await AsyncStorage.setItem('userID', userDoc.id);
                    
                    Alert.alert("Login realizado com sucesso!");
                    navigation.navigate('Home');
                } else {
                    Alert.alert("Erro", "Credenciais inválidas. Tente novamente.");
                }
            } else {
                Alert.alert("Erro", "Usuário não encontrado. Cadastre-se primeiro.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            Alert.alert("Erro", "Ocorreu um erro ao realizar o login. Tente novamente.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
            <Text style={styles.header}>Login</Text>
            <Image source={LogoDengueAlert} style={styles.logo} />
            </View>

            <TextInput
                style={styles.name}
                placeholder="Nome de Usuário"
                value={identifier}
                onChangeText={setIdentifier}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconButton}>
                    <Icon name={showPassword ? "visibility" : "visibility-off"} size={24} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NewUser')}>
                <Text style={styles.buttonText}>Cadastrar-se</Text>
            </TouchableOpacity>
        </View>
    );
}
