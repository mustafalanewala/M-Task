// src/App.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, clearUser } from './redux/userSlice';
import { auth } from './firebase/firebaseConfig';
import Login from './components/Auth/Login';
import Logout from './components/Auth/Logout';
import Dashboard from './pages/Dashboard'; 

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
                    photoURL: user.photoURL,
                }));
            } else {
                dispatch(clearUser());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return (
        <div className="App">
            {user ? (
                <div>
                    <h1>Welcome, {user.displayName}</h1>
                    <Logout />
                    <Dashboard />
                </div>
            ) : (
                <Login />
            )}
        </div>
    );
};

export default App;
