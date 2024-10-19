// src/pages/Dashboard.js
import React from 'react';
// import TaskForm from '../components/Task/TaskForm';
import TaskList from '../components/Task/TaskList';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <TaskList />
        </div>
    );
};

export default Dashboard;
