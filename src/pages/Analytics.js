import React from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';

// Register chart components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement 
);

const Analytics = ({ tasks }) => {
  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const failedTasks = tasks.filter(task => task.status === 'failed').length;
  const pendingTasks = totalTasks - (completedTasks + failedTasks);

  // Data for Pie Chart (Task Status Distribution)
  const pieData = {
    labels: ['Completed', 'Pending', 'Failed'],
    datasets: [
      {
        data: [completedTasks, pendingTasks, failedTasks],
        backgroundColor: ['#4caf50', '#ffeb3b', '#f44336'],
        hoverBackgroundColor: ['#388e3c', '#fbc02d', '#d32f2f'],
      },
    ],
  };

  // Data for Bar Chart (Tasks by Category)
  const categoryCounts = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: 'Tasks by Category',
        data: Object.values(categoryCounts),
        backgroundColor: '#3f51b5',
        borderColor: '#303f9f',
        borderWidth: 1,
      },
    ],
  };

  // Data for Line Chart (Tasks Due Dates)
  const tasksOverTime = tasks.reduce((acc, task) => {
    const date = new Date(task.dueDate);
    const day = date.toLocaleDateString('default', { day: '2-digit', month: 'short' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const lineData = {
    labels: Object.keys(tasksOverTime),
    datasets: [
      {
        label: 'Tasks Due Dates',
        data: Object.values(tasksOverTime),
        fill: false,
        borderColor: '#ff9800',
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart options for better responsiveness and display
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,  // Allow height and width adjustments
  };

  return (
    <div className="analytics-dashboard container mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold p-1 mb-6">Tasks Analytics</h2>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* Pie Chart - Task Status Distribution */}
        <div className="bg-gray-300 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Task Status Distribution</h3>
          <div className="h-72 w-full sm:h-96 lg:h-80 xl:h-96 mx-auto"> {/* Adjusted size for responsiveness */}
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        {/* Bar Chart - Tasks by Category */}
        <div className="bg-gray-300 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Tasks by Category</h3>
          <div className="h-72 w-full sm:h-96 lg:h-80 xl:h-96 mx-auto"> {/* Adjusted size for responsiveness */}
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Line Chart - Tasks Due Dates */}
        <div className="bg-gray-300 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-center">Tasks Due Dates</h3>
          <div className="h-72 w-full sm:h-96 lg:h-80 xl:h-96 mx-auto"> {/* Adjusted size for responsiveness */}
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
