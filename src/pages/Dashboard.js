// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLogOut, FiHome, FiBell, FiBarChart } from 'react-icons/fi'; 
import TaskList from '../components/Task/TaskList';
import Notification from '../components/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { auth } from '../firebase/firebaseConfig';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.user.userInfo);
    
    const [activeComponent, setActiveComponent] = useState('taskList');

    useEffect(() => {
        if (location.pathname === '/notification') setActiveComponent('notification');
        else setActiveComponent('taskList');
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await auth.signOut(); 
            dispatch(clearUser());
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    const handleNavigation = (component) => {
        setActiveComponent(component);
        navigate(`/${component === 'taskList' ? '' : component}`);
    };

    return (
        <div className="flex bg-gray-100">
            <div className="bg-gray-800 text-white flex flex-col justify-between items-center p-4 w-16 fixed h-full">
                <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center justify-center bg-gray-600 rounded-full w-10 h-10 text-xl font-bold mb-4">
                        {user?.displayName?.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex flex-col items-center space-y-6">
                        <div className="cursor-pointer" onClick={() => handleNavigation('taskList')}>
                            <FiHome size={28} className={`text-gray-400 hover:text-white ${activeComponent === 'taskList' && 'text-white'}`} />
                        </div>
                        <div className="cursor-pointer" onClick={() => handleNavigation('notification')}>
                            <FiBell size={28} className={`text-gray-400 hover:text-white ${activeComponent === 'notification' && 'text-white'}`} />
                        </div>
                        <div className="cursor-pointer" onClick={() => handleNavigation('analysis')}>
                            <FiBarChart size={28} className="text-gray-400 hover:text-white" />
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <FiLogOut size={32} className="cursor-pointer text-red-600 hover:text-red-500" onClick={handleLogout} />
                </div>
            </div>

            <div className="ml-16 flex-grow overflow-y-auto">
                <div className="bg-white rounded-lg shadow-md p-4">
                    {activeComponent === 'taskList' && <TaskList />}
                    {activeComponent === 'notification' && <Notification />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
