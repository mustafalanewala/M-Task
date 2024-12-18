import React, { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";

const Notification = ({ tasks }) => {
  const [notifications, setNotifications] = useState({
    today: [],
    tomorrow: [],
    upcoming: [],
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const categorizedNotifications = categorizeNotifications(tasks);
    setNotifications(categorizedNotifications);
  }, [tasks]);

  const categorizeNotifications = (tasks) => {
    const now = new Date();
    const categorized = { today: [], tomorrow: [], upcoming: [] };

    tasks.forEach((task) => {
      const dueDate = new Date(task.dueDate);
      const daysDiff = Math.ceil((dueDate - now) / (1000 * 3600 * 24));

      if (daysDiff === 0) categorized.today.push(task);
      else if (daysDiff === 1) categorized.tomorrow.push(task);
      else if (daysDiff > 1) categorized.upcoming.push(task);
    });

    return categorized;
  };

  const filteredNotifications =
    filter === "all" ? notifications : { [filter]: notifications[filter] };

  return (
    <div className="container mx-auto">
      <header className="mb-6 flex flex-col sm:flex-row justify-between">
        <h2 className="text-xl sm:text-2xl font-bold p-1">Notifications</h2>
        <div className="flex flex-wrap sm:mt-0">
          {["all", "today", "tomorrow", "upcoming"].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className="mt-2 sm:mt-0 font-bold bg-green-500 text-white px-4 py-2 rounded flex items-center mr-2"
            >
              {formatButtonLabel(option)}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(filteredNotifications).map(
          ([key, tasks]) =>
            tasks.length > 0 &&
            tasks.map((task, index) => (
              <NotificationCard
                key={`${key}-${index}`}
                status={key}
                task={task}
              />
            ))
        )}
        {Object.values(filteredNotifications).every(
          (group) => group.length === 0
        ) && (
          <p className="col-span-full text-center text-gray-500">
            No upcoming tasks!
          </p>
        )}
      </div>
    </div>
  );
};

const NotificationCard = ({ status, task }) => (
  <div
    className={`p-6 rounded-lg shadow-lg transition-transform transform ${getCardStyles(
      status
    )}`}
  >
    <h3 className="font-semibold text-xl mb-4 flex items-center">
      <FiBell size={28} className="mr-2" />
      {formatNotificationTitle(status)}
    </h3>
    <ul className="space-y-2">
      <li className="flex flex-col justify-between items-start text-gray-800">
        <span className="font-medium">{task.name}</span>
        <span className="font-medium">{task.description}</span>
        <span className="text-sm font-light">
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </li>
    </ul>
  </div>
);

const getCardStyles = (status) => {
  switch (status) {
    case "today":
      return "bg-red-50 border-l-4 border-red-400";
    case "tomorrow":
      return "bg-blue-50 border-l-4 border-blue-400";
    case "upcoming":
      return "bg-gray-100 border-l-4 border-gray-400";
    default:
      return "bg-gray-10 border-l-4 border-gray-400";
  }
};

const formatButtonLabel = (filter) => {
  const labels = {
    all: "All",
    today: "Today",
    tomorrow: "Tomorrow",
    upcoming: "Upcoming",
  };
  return labels[filter];
};

const formatNotificationTitle = (key) => {
  const titles = {
    today: "Tasks Due Today",
    tomorrow: "Tasks Due Tomorrow",
    upcoming: "Upcoming Tasks",
  };
  return titles[key] || "Upcoming Tasks";
};

export default Notification;
