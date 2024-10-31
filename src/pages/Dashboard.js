// src/pages/Dashboard.js
import React, { useState } from 'react';
import { FiLogOut, FiHome, FiBell, FiBarChart } from 'react-icons/fi'; 
import TaskList from '../components/Task/TaskList';
import Notification from '../components/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { auth } from '../firebase/firebaseConfig';

const Dashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    
    // State to control which component is displayed
    const [activeComponent, setActiveComponent] = useState('taskList');

    const handleLogout = async () => {
        try {
            await auth.signOut(); 
            dispatch(clearUser());
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Fixed Sidebar */}
            <div className="bg-gray-800 text-white flex flex-col justify-between items-center p-4 w-16 fixed h-full">
                {/* Profile and Icons */}
                <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center justify-center bg-gray-600 rounded-full w-10 h-10 text-xl font-bold mb-4">
                        {user?.displayName?.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Navigation Icons */}
                    <div className="flex flex-col items-center space-y-6">
                        <div className="cursor-pointer" onClick={() => setActiveComponent('taskList')}>
                            <FiHome 
                                size={28} 
                                className="text-gray-400 hover:text-white" 
                            />
                        </div>
                        <div className="cursor-pointer" onClick={() => setActiveComponent('notification')}>
                            <FiBell 
                                size={28} 
                                className="text-gray-400 hover:text-white" 
                            />
                        </div>
                        <div className="cursor-pointer" onClick={() => setActiveComponent('analysis')}>
                            <FiBarChart 
                                size={28} 
                                className="text-gray-400 hover:text-white" 
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Logout icon */}
                <div className="mb-2">
                    <FiLogOut 
                        size={32} 
                        className="cursor-pointer text-red-600 hover:text-red-500" 
                        onClick={handleLogout}
                    />
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="ml-16 flex-grow p-4 overflow-y-auto">
                {/* Render component based on active state */}
                {activeComponent === 'taskList' && <TaskList />}
                {activeComponent === 'notification' && <Notification />}
            </div>
        </div>
    );
};

export default Dashboard;
