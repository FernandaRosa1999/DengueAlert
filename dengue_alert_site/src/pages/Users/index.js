import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import { getAuth } from "firebase/auth"; 

import { database } from "../../config/firebaseconfig";
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { IoEye, IoEyeOff } from 'react-icons/io5'; 
import Logo from '../../assets/images/LogoDengueAlert.png'
import './style.css'; 

export default function User() {
    const navigate = useNavigate(); 
    const [identifier, setIdentifier] = useState(""); 
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true); 
        
        try {
            const userQuery = query(
                collection(database, "AdminUsers"), 
                where("user", "==", identifier)
            );

            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                const userData = userDoc.data();

                if (userData.password === password) { 
                    // Salva o ID do usuário no localStorage
                    localStorage.setItem('userID', userDoc.id);
                    navigate('/home');
                } else {
                    alert("Credenciais inválidas. Tente novamente.");
                }
            } else {
                alert("Usuário não encontrado. Cadastre-se primeiro.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Ocorreu um erro ao realizar o login. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <img src={Logo} style={{ maxWidth: '40%', height: 'auto' }}/>
            <h2 >Login</h2>
            <input
                className="input"
                placeholder="Nome de Usuário"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                aria-label="Nome de Usuário" // Adicionando acessibilidade
            />
            <div className="passwordContainer">
                <input
                    className="input"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    aria-label="Senha" // Adicionando acessibilidade
                />
                <button onClick={() => setShowPassword(!showPassword)} className="iconButton" aria-label="Toggle Password Visibility">
                    {showPassword ? <IoEyeOff size={24} /> : <IoEye size={24} />} {/* Usando ícones específicos */}
                </button>
            </div>
            <button className="button" onClick={handleLogin} disabled={loading}>
                {loading ? "Carregando..." : "Login"} {/* Mostrando carregamento */}
            </button>
            <button className="button" onClick={() => navigate('/AppUsers')}>
                Cadastrar-se
            </button>
        </div>
    );
}
