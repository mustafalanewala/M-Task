import React from 'react';
import { FiLogOut } from 'react-icons/fi'; 
import TaskList from '../components/Task/TaskList';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/userSlice';
import { auth } from '../firebase/firebaseConfig';

const Dashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);

    // Logout handler
    const handleLogout = async () => {
        try {
            await auth.signOut(); // Sign out from Firebase
            dispatch(clearUser()); // Clear user info from Redux store
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    // Get the first letter of the user's name
    const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : '';

    return (
        <div className="flex h-screen">
            {/* Fixed Sidebar */}
            <div className="bg-gray-800 text-white flex flex-col justify-between items-center p-4 w-16 fixed h-full">
                {/* Profile icon at the top */}
                <div className="flex items-center justify-center bg-gray-600 rounded-full w-10 h-10 text-xl font-bold">
                    {userInitial}
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

            {/* Main Dashboard Content with Scrollable Task List */}
            <div className="ml-16 flex-grow p-4 overflow-y-auto">
                <TaskList />
            </div>
        </div>
    );
};

export default Dashboard;
