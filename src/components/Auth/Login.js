import React from 'react';
import { signInWithGoogle } from '../../firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const user = await signInWithGoogle();
            dispatch(setUser({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
            }));
            toast.success("Login successful!");
        } catch (error) {
            toast.error("Login failed. Please try again.");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-5xl font-bold mb-6 text-center">Welcome To MTask</h1>
            <p className="text-lg mb-4 text-gray-600">Please sign in to continue</p>
            <button 
                onClick={handleLogin} 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
                Sign in with Google
            </button>
            <ToastContainer />
        </div>
    );
};

export default Login;
