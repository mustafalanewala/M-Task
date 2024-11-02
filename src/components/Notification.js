// src/components/Notification.js
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiLoader, FiCheckCircle, FiInfo, FiXCircle } from "react-icons/fi";
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
    const [filter, setFilter] = useState("all");
    const tasks = useSelector((state) => state.tasks.taskList);

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
        const categorized = { today: [], oneDay: [], twoDays: [], threeDays: [] };

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

    const filteredNotifications = filter === "all" ? notifications : { [filter]: notifications[filter] };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full">
                <header className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-800">Notifications</h2>
                    <div className="space-x-2 flex">
                        {["all", "today", "oneDay", "twoDays", "threeDays"].map((option) => (
                            <button
                                key={option}
                                onClick={() => setFilter(option)}
                                className={`px-3 py-1 rounded-full font-semibold text-sm ${filter === option ? `bg-${getColor(option)}-600 text-white` : "bg-gray-200 text-gray-700"}`}
                            >
                                {formatButtonLabel(option)}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading ? (
                        <div className="col-span-full flex justify-center items-center text-gray-600">
                            <FiLoader size={24} className="animate-spin mr-2" />
                            Loading notifications...
                        </div>
                    ) : (
                        Object.entries(filteredNotifications).map(([key, tasks]) => (
                            tasks.length > 0 && (
                                <NotificationCard key={key} status={key} tasks={tasks} />
                            )
                        ))
                    )}
                    {Object.values(filteredNotifications).every((group) => group.length === 0) && (
                        <p className="col-span-full text-center text-gray-500">
                            No upcoming tasks!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const NotificationCard = ({ status, tasks }) => (
    <div className={`p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${getCardStyles(status)}`}>
        <h3 className="font-semibold text-lg mb-4 flex items-center">
            <NotificationIcon status={status} className="mr-2" />
            {formatNotificationTitle(status)}
        </h3>
        <ul className="space-y-2">
            {tasks.map((task, index) => (
                <li key={index} className="flex justify-between items-center text-gray-800">
                    <span className="font-medium">{task.name}</span>
                    <span className="text-sm font-light">{new Date(task.dueDate).toLocaleDateString()}</span>
                </li>
            ))}
        </ul>
    </div>
);

const NotificationIcon = ({ status }) => {
    switch (status) {
        case 'today':
            return <FiCheckCircle size={24} className="text-green-500" />;
        case 'oneDay':
            return <FiInfo size={24} className="text-blue-500" />;
        case 'twoDays':
            return <FiInfo size={24} className="text-orange-500" />;
        case 'threeDays':
            return <FiXCircle size={24} className="text-red-500" />;
        default:
            return <FiInfo size={24} className="text-gray-500" />;
    }
};

const getCardStyles = (status) => {
    switch (status) {
        case 'today': return "bg-green-50 border-l-4 border-green-400";
        case 'oneDay': return "bg-blue-50 border-l-4 border-blue-400";
        case 'twoDays': return "bg-orange-50 border-l-4 border-orange-400";
        case 'threeDays': return "bg-red-50 border-l-4 border-red-400";
        default: return "bg-gray-50 border-l-4 border-gray-400";
    }
};

const getColor = (filter) => {
    switch (filter) {
        case 'today': return 'green';
        case 'oneDay': return 'blue';
        case 'twoDays': return 'orange';
        case 'threeDays': return 'red';
        default: return 'gray';
    }
};

const formatButtonLabel = (filter) => {
    const labels = {
        all: "All",
        today: "Today",
        oneDay: "Tomorrow",
        twoDays: "2 Days",
        threeDays: "3 Days",
    };
    return labels[filter];
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
