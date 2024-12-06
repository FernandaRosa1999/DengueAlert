import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { database } from "../../config/firebaseconfig";
import { IoArrowBack, IoEye, IoEyeOff } from "react-icons/io5";
import "./style.css";

export default function NewUser() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [matricula, setMatricula] = useState("");
    const [role, setRole] = useState("Auditor"); 
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ user: "", email: "", password: "", fullName: "", matricula: "" });

    // Validação de senha
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
            collection(database, "AdminUsers"),
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
            collection(database, "AdminUsers"),
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
                await addDoc(collection(database, "AdminUsers"), {
                    user,
                    fullName,
                    email,
                    password, 
                    matricula,
                    role,
                    createdAt: new Date(),
                    isActive: true
                });
                alert("Cadastro realizado com sucesso!");
                setUser("");
                setFullName("");
                setEmail("");
                setPassword("");
                setMatricula("");
                setRole("Auditor");
                setErrors({ user: "", email: "", password: "", fullName: "", matricula: "" });
            } catch (error) {
                console.error("Erro ao cadastrar usuário:", error);
                alert("Erro ao realizar o cadastro. Tente novamente.");
            }
        }
    };

    return (
        <div className="container">
            <button onClick={() => navigate('/')} className="backIcon">
                <IoArrowBack size={24} />
            </button>

            <h2>Cadastro de Usuário</h2>

            <input
                className="smallInput"
                placeholder="Nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <span className="errorText">{errors.fullName}</span>}

            <input
                className="smallInput"
                placeholder="Nome do usuário"
                value={user}
                onChange={(e) => setUser(e.target.value)}
            />
            {errors.user && <span className="errorText">{errors.user}</span>}

            <input
                className="smallInput"
                placeholder="Matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
            />
            {errors.matricula && <span className="errorText">{errors.matricula}</span>}

            <input
                className="smallInput"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
            />
            {errors.email && <span className="errorText">{errors.email}</span>}

            <div className="passwordContainer">
                <input
                    className="input"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                />
                <button onClick={() => setShowPassword(!showPassword)} className="eyeIcon">
                    {showPassword ? <IoEyeOff size={24} /> : <IoEye size={24} />}
                </button>
            </div>
            {errors.password && <span className="errorText">{errors.password}</span>}

            <select
                className="smallInput"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="Auditor">Auditor</option>
                <option value="Gerente">Gerente</option>
            </select>

            <button className="button" onClick={handleSignUp}>Cadastrar</button>
        </div>
    );
}
