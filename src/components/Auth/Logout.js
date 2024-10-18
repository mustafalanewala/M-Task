// src/components/Auth/Logout.js
import React from 'react';
import { signOutUser } from '../../firebase/auth';

const Logout = () => {
    const handleLogout = async () => {
        await signOutUser();
    };

    return (
        <button onClick={handleLogout} className="btn-logout">
            Logout
        </button>
    );
};

export default Logout;
