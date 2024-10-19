// src/components/Auth/Login.js
import React from 'react';
import { signInWithGoogle } from '../../firebase/auth';
import { FiLogIn } from 'react-icons/fi'; // Importing an icon for a modern touch

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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Welcome to MTask
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    Your personal task manager. Stay organized, be productive!
                </p>
                <button 
                    onClick={handleLogin} 
                    className="flex items-center justify-center w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md transform hover:scale-105"
                >
                    <FiLogIn className="mr-2" />
                    Sign in with Google
                </button>
                <p className="text-center text-gray-500 mt-6">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Login;
