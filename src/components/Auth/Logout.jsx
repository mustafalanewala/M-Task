// src/components/Auth/Logout.js
import React from 'react';
import { signOutUser } from '../../firebase/auth';

const Logout = () => {
    const handleLogout = async () => {
        await signOutUser();
    };

    return (
        <button onClick={handleLogout} className="btn-logout bg-red-500 px-4 py-2 font-bold rounded-lg">
            Logout
        </button>
    );
};

export default Logout;
