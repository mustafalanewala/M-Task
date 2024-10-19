// src/App.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, clearUser } from './redux/userSlice';
import { auth } from './firebase/firebaseConfig';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(setUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                }));
            } else {
                dispatch(clearUser());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return (
        <div className="App p-4">
            {user ? (
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Hello, {user.displayName}</h1>
                    <Logout />
                </div>
            ) : (
                <Login />
            )}
            {/* Only show Dashboard if user is authenticated */}
            {user && <Dashboard />}
            <ToastContainer /> 
        </div>
    );
};

export default App;
