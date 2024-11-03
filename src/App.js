// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, clearUser } from './redux/userSlice';
import { auth } from './firebase/firebaseConfig';
import Login from './components/Auth/Login';
import Dashboard from './pages/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Puff } from 'react-loader-spinner';

const App = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
        });

        return () => unsubscribe();
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <Puff color="#00BFFF" height={100} width={100} />
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    {user ? (
                        <>
                            <Route path="/task" element={<Dashboard />} /> {/* Main entry point for Dashboard */}
                            <Route path="/notification" element={<Dashboard />} />
                            <Route path="*" element={<Navigate to="/task" />} /> {/* Redirect all unknown routes to /task */}
                        </>
                    ) : (
                        <>
                            <Route path="/login" element={<Login />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    )}
                </Routes>
                <ToastContainer />
            </div>
        </Router>
    );
};

export default App;
