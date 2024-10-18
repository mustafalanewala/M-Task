// src/components/Auth/Login.js
import React from 'react';
import { signInWithGoogle } from '../../firebase/auth';

const Login = () => {
    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            // Redirect user or perform other actions after login if needed
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <button onClick={handleLogin} className="btn-login">
                Sign in with Google
            </button>
        </div>
    );
};

export default Login;
