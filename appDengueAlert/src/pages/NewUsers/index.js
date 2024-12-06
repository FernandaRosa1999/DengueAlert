import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { database } from "../../config/firebaseconfig";
import { Ionicons } from '@expo/vector-icons';
import styles from "./style";

export default function NewUser() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState("");
    const [user, setUser] = useState(""); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ user: "", email: "", password: "", fullName: "" });

    const validatePassword = () => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*]/.test(password);
        const isValidLength = password.length >= 8;

        const newErrors = {};

        if (!isValidLength) newErrors.password = "A senha deve ter no mínimo 8 caracteres.";
        if (!hasUpperCase) newErrors.password = "A senha deve conter pelo menos uma letra maiúscula.";
        if (!hasLowerCase) newErrors.password = "A senha deve conter pelo menos uma letra minúscula.";
        if (!hasNumbers) newErrors.password = "A senha deve conter pelo menos um número.";
        if (!hasSpecialChar) newErrors.password = "A senha deve conter pelo menos um símbolo (!@#$%^&*).";

        setErrors({ ...errors, password: Object.values(newErrors).join(" ") });
        return Object.keys(newErrors).length === 0;
    };

    const checkUserAvailability = async () => {
        const userQuery = query(
            collection(database, "AppUsers"),
            where("user", "==", user)
        );
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
            setErrors({ ...errors, user: "Nome de usuário já em uso." });

            setTimeout(() => {
                setErrors(prevErrors => ({ ...prevErrors, user: "" }));
            }, 10000);

            return false;
        }
        setErrors({ ...errors, user: "" });
        return true;
    };

    const checkEmailAvailability = async () => {
        const emailQuery = query(
            collection(database, "AppUsers"),
            where("email", "==", email)
        );
        const querySnapshot = await getDocs(emailQuery);
        if (!querySnapshot.empty) {
            setErrors({ ...errors, email: "Email já cadastrado." });

            setTimeout(() => {
                setErrors(prevErrors => ({ ...prevErrors, email: "" }));
            }, 10000);

            return false;
        }
        setErrors({ ...errors, email: "" });
        return true;
    };

    const handleSignUp = async () => {
        const isUserAvailable = await checkUserAvailability();
        const isEmailAvailable = await checkEmailAvailability();
        const isPasswordValid = validatePassword();

        if (isUserAvailable && isEmailAvailable && isPasswordValid) {
            try {
                await addDoc(collection(database, "AppUsers"), {
                    user, 
                    name: fullName, 
                    email,
                    password, 
                    createdAt: new Date(), 
                    isActive: true, 
                });
                Alert.alert("Cadastro realizado com sucesso!");
                setUser("");
                setFullName("");
                setEmail("");
                setPassword("");
                setErrors({ user: "", email: "", password: "", fullName: "" });
            } catch (error) {
                console.error("Erro ao cadastrar usuário:", error);
                Alert.alert("Erro", "Ocorreu um erro ao realizar o cadastro. Tente novamente.");
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('User')} style={styles.backIcon}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.header}>Cadastro de Usuário</Text>

            <TextInput
                style={styles.smallInput}
                placeholder="Nome completo"
                value={fullName}
                onChangeText={setFullName}
            />
            {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

            <TextInput
                style={styles.smallInput}
                placeholder="Nome do usuário"
                value={user}
                onChangeText={setUser}
            />
            {errors.user ? <Text style={styles.errorText}>{errors.user}</Text> : null}

            <TextInput
                style={styles.smallInput}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                >
                    <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

            <Button title="Cadastrar" onPress={handleSignUp} />
        </View>
    );
}
