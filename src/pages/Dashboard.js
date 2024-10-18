// src/pages/Dashboard.js
import React from 'react';
import TaskForm from '../components/Task/TaskForm';
import TaskList from '../components/Task/TaskList';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Task Dashboard</h1>
            <TaskForm />
            <TaskList />
        </div>
    );
};

export default Dashboard;
