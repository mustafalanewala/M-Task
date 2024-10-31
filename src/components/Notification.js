// src/components/Notification.js
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiCheckCircle, FiInfo, FiXCircle } from "react-icons/fi";
import { auth } from "../firebase/firebaseConfig";
import { fetchUserTasks } from "../firebase/taskService";

const Notification = () => {
    const [notifications, setNotifications] = useState({
        today: [],
        oneDay: [],
        twoDays: [],
        threeDays: [],
    });
    const [loading, setLoading] = useState(false);
    const tasks = useSelector((state) => state.tasks.taskList); // Get tasks from Redux

    useEffect(() => {
        const loadNotifications = async () => {
            if (auth.currentUser) {
                setLoading(true);
                const tasksFromDb = await fetchUserTasks(auth.currentUser.uid);
                const notifications = categorizeNotifications(tasksFromDb);
                setNotifications(notifications);
                setLoading(false);
            }
        };

        loadNotifications();
    }, [tasks]);

    const categorizeNotifications = (tasks) => {
        const now = new Date();
        const categorized = {
            today: [],
            oneDay: [],
            twoDays: [],
            threeDays: [],
        };

        tasks.forEach((task) => {
            const dueDate = new Date(task.dueDate);
            const daysDiff = Math.ceil((dueDate - now) / (1000 * 3600 * 24));

            if (daysDiff === 0) categorized.today.push(task);
            else if (daysDiff === 1) categorized.oneDay.push(task);
            else if (daysDiff === 2) categorized.twoDays.push(task);
            else if (daysDiff === 3) categorized.threeDays.push(task);
        });

        return categorized;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-2">Notifications</h2>
            <div className="mt-4">
                {loading ? (
                    <p>Loading notifications...</p>
                ) : (
                    <>
                        {Object.entries(notifications).map(([key, tasks]) => (
                            tasks.length > 0 && (
                                <div key={key} className="mb-4">
                                    <h3 className="font-semibold text-md text-gray-800 flex items-center">
                                        <NotificationIcon status={key} className="mr-2" />
                                        {formatNotificationTitle(key)}
                                    </h3>
                                    <ul className="list-disc pl-5">
                                        {tasks.map((task, index) => (
                                            <li key={index} className="text-gray-700">
                                                {task.name} - Due on:{" "}
                                                <span className="font-medium">
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        ))}
                        {Object.values(notifications).every((group) => group.length === 0) && (
                            <p className="text-gray-500">No upcoming tasks!</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const NotificationIcon = ({ status }) => {
    switch (status) {
        case 'today':
            return <FiCheckCircle className="text-green-500" />;
        case 'oneDay':
            return <FiInfo className="text-blue-500" />;
        case 'twoDays':
            return <FiInfo className="text-orange-500" />;
        case 'threeDays':
            return <FiXCircle className="text-red-500" />;
        default:
            return <FiInfo className="text-gray-500" />;
    }
};

const formatNotificationTitle = (key) => {
    const titles = {
        today: "Tasks Due Today",
        oneDay: "Tasks Due Tomorrow",
        twoDays: "Tasks Due in 2 Days",
        threeDays: "Tasks Due in 3 Days",
    };
    return titles[key] || "Upcoming Tasks";
};

export default Notification;
