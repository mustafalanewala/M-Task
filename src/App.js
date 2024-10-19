import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, clearUser } from './redux/userSlice';
import { auth } from './firebase/firebaseConfig';
import Login from './components/Auth/Login';
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
        <div className="App">
            {user ? (
                <Dashboard />
            ) : (
                <Login />
            )}
            <ToastContainer /> 
        </div>
    );
};

export default App;
