import React, { useEffect, useState } from "react";
import { fetchUserTasks } from "../../firebase/taskService";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../../redux/tasksSlice";
import TaskEditForm from "./TaskEditForm";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import { auth } from "../../firebase/firebaseConfig";
import "react-toastify/dist/ReactToastify.css";
import { FiPlus } from "react-icons/fi";

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.taskList); // Get list of tasks from Redux store
  const [editingTask, setEditingTask] = useState(null); // Track the task being edited
  const [showEditModal, setShowEditModal] = useState(false); // Toggle for edit modal
  const [showAddModal, setShowAddModal] = useState(false); // Toggle for add modal
  const [filter, setFilter] = useState("all"); // Filter for tasks (all, completed, failed)
  const [sortOrder, setSortOrder] = useState("default"); // Sort order for tasks
  const [loading, setLoading] = useState(false); // Track loading state

  useEffect(() => {
    const loadTasks = async () => {
      if (auth.currentUser) {
        setLoading(true);
        const tasksFromDb = await fetchUserTasks(auth.currentUser.uid);
        const updatedTasks = tasksFromDb.map((task) => {
          const dueDate = new Date(task.dueDate);
          const currentDate = new Date();
          dueDate.setHours(0, 0, 0, 0);
          currentDate.setHours(0, 0, 0, 0);
          if (dueDate < currentDate && task.status !== "completed") {
            return { ...task, status: "failed" };
          }
          return task;
        });
        dispatch(setTasks(updatedTasks));
        setLoading(false);
      }
    };
    loadTasks();
  }, [dispatch]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.status === "completed";
    if (filter === "failed") return task.status === "failed";
    return true;
  });

  const sortedTasks = (() => {
    let sorted = [...filteredTasks];
    if (sortOrder === "asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }
    return sorted;
  })();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const failedTasks = tasks.filter((task) => task.status === "failed").length;
  const pendingTasks = totalTasks - (completedTasks + failedTasks);

  return (
    <div className="task-list">
      <div className="flex flex-row sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold p-1">Task Dashboard</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="font-bold bg-green-500 text-white px-4 py-2 rounded flex items-center"
        >
          <FiPlus className="mr-2" />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-200 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Overall Tasks!</h3>
          <p className="text-3xl font-bold text-gray-800">{totalTasks}</p>
        </div>
        <div className="bg-green-200 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Completed Tasks!</h3>
          <p className="text-3xl font-bold text-gray-800">{completedTasks}</p>
        </div>
        <div className="bg-yellow-200 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Pending Tasks!</h3>
          <p className="text-3xl font-bold text-gray-800">{pendingTasks}</p>
        </div>
        <div className="bg-red-200 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Failed Tasks!</h3>
          <p className="text-3xl font-bold text-gray-800">{failedTasks}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="filter-sort-controls space-x-4">
          <select
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            className="p-2 border rounded"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed Tasks</option>
            <option value="failed">Failed Tasks</option>
          </select>
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
            className="p-2 border rounded"
          >
            <option value="default">Sort By</option>
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              setEditingTask={setEditingTask}
              setShowEditModal={setShowEditModal}
            />
          ))}
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="max-w-sm w-full sm:max-w-lg">
            <TaskEditForm
              task={editingTask}
              onClose={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="max-w-sm w-full sm:max-w-lg">
            <TaskForm onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
