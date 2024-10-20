// src/components/TaskList.js
import React, { useEffect, useState } from "react";
import {
  fetchUserTasks,
  deleteTask as deleteTaskService,
  updateTaskStatus,
} from "../../firebase/taskService";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  deleteTask,
  updateTask as updateTaskAction,
} from "../../redux/tasksSlice";
import TaskEditForm from "./TaskEditForm";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import { auth } from "../../firebase/firebaseConfig"; // Make sure to import auth

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.taskList);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      if (auth.currentUser) {
        setLoading(true);
        const tasksFromDb = await fetchUserTasks(auth.currentUser.uid); // Fetch user-specific tasks
        dispatch(setTasks(tasksFromDb));
        setLoading(false);
      }
    };

    loadTasks();
  }, [dispatch]);

  const handleDelete = async (id) => {
    const userId = auth.currentUser.uid; // Get the authenticated user ID
    setLoading(true);
    try {
      await deleteTaskService(userId, id); // Pass the user ID and task ID
      dispatch(deleteTask(id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (task) => {
    setLoading(true);
    const userId = auth.currentUser.uid; // Get userId from the authenticated user
    try {
      await updateTaskStatus(userId, task.id, "completed"); // Pass userId
      const updatedTask = { ...task, status: "completed" };
      dispatch(updateTaskAction(updatedTask));
      toast.success("Task marked as completed!");
    } catch (error) {
      console.error("Error marking task as completed:", error);
      toast.error("Failed to mark task as completed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFail = async (task) => {
    setLoading(true);
    const userId = auth.currentUser.uid; // Get userId from the authenticated user
    try {
      await updateTaskStatus(userId, task.id, "failed"); // Pass userId
      const updatedTask = { ...task, status: "failed" };
      dispatch(updateTaskAction(updatedTask));
      toast.error("Task marked as failed!");
    } catch (error) {
      console.error("Error marking task as failed:", error);
      toast.error("Failed to mark task as failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.status === "completed";
    if (filter === "failed") return task.status === "failed";
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  // Count tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const failedTasks = tasks.filter((task) => task.status === "failed").length;
  const pendingTasks = totalTasks - (completedTasks + failedTasks);

  return (
    <div className="task-list">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold p-1">Task Dashboard</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 text-white px-6 rounded flex items-center"
        >
          <FiPlus className="mr-2" />
          New Task
        </button>
      </div>
      {/* Task Summary Section */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-200 p-4 rounded shadow">
          <h3 className="font-semibold">Total Tasks</h3>
          <p className="text-2xl">{totalTasks}</p>
        </div>
        <div className="bg-green-200 p-4 rounded shadow">
          <h3 className="font-semibold">Completed Tasks</h3>
          <p className="text-2xl">{completedTasks}</p>
        </div>
        <div className="bg-yellow-200 p-4 rounded shadow">
          <h3 className="font-semibold">Pending Tasks</h3>
          <p className="text-2xl">{pendingTasks}</p>
        </div>
        <div className="bg-red-200 p-4 rounded shadow">
          <h3 className="font-semibold">Failed Tasks</h3>
          <p className="text-2xl">{failedTasks}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
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
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded mb-2 ${
                task.status === "completed"
                  ? "bg-green-100"
                  : task.status === "failed"
                  ? "bg-red-100"
                  : "bg-yellow-100"
              } shadow relative`}
            >
              <h3 className="text-lg font-semibold">{task.name}</h3>
              <p>{task.description}</p>
              <p>
                <strong>Category:</strong> {task.category}
              </p>
              <p>
                <strong>Due Date:</strong> {task.dueDate}
              </p>

              <div className="absolute top-2 right-2 space-x-2 flex">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <FiEdit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FiTrash size={20} />
                </button>
              </div>

              <div className="flex space-x-2 mt-2 text-sm font-semibold">
                <button
                  onClick={() => handleComplete(task)}
                  className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-200"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => handleFail(task)}
                  className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-200"
                >
                  Mark as Failed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <TaskEditForm
              task={editingTask}
              onClose={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <TaskForm onClose={() => setShowAddModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
