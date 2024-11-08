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
import { auth } from "../../firebase/firebaseConfig";
import "react-toastify/dist/ReactToastify.css";

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
    // Fetch and load tasks when the component mounts
    const loadTasks = async () => {
      if (auth.currentUser) {
        // Check if the user is authenticated
        setLoading(true);
        const tasksFromDb = await fetchUserTasks(auth.currentUser.uid); // Fetch tasks from database

        // Automatically mark tasks as "failed" if the due date has passed and the task is not completed
        const updatedTasks = tasksFromDb.map((task) => {
          const dueDate = new Date(task.dueDate);
          const currentDate = new Date();

          // Set the time of both dates to midnight to compare only the date part
          dueDate.setHours(0, 0, 0, 0);
          currentDate.setHours(0, 0, 0, 0);

          // If due date is before today and the status is not "completed," mark as "failed"
          if (dueDate < currentDate && task.status !== "completed") {
            return { ...task, status: "failed" };
          }
          return task;
        });

        // Update the Redux store with the modified tasks
        dispatch(setTasks(updatedTasks));
        setLoading(false); // Set loading to false when done
      }
    };
    loadTasks(); // Execute loadTasks
  }, [dispatch]);

  // Delete a task
  const handleDelete = async (id) => {
    const userId = auth.currentUser.uid;
    setLoading(true); // Set loading to true while deleting a task
    try {
      await deleteTaskService(userId, id); // Delete the task in the database
      dispatch(deleteTask(id)); // Remove the task from Redux store
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  // Mark a task as completed
  const handleComplete = async (task) => {
    setLoading(true); // Set loading to true while updating status
    const userId = auth.currentUser.uid;
    try {
      await updateTaskStatus(userId, task.id, "completed"); // Update the status in the database
      const updatedTask = { ...task, status: "completed" }; // Update local task data
      dispatch(updateTaskAction(updatedTask)); // Update Redux store
      toast.success("Task marked as completed!");
    } catch (error) {
      console.error("Error marking task as completed:", error);
      toast.error("Failed to mark task as completed.");
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  // Mark a task as failed
  const handleFail = async (task) => {
    setLoading(true); // Set loading to true while updating status
    const userId = auth.currentUser.uid;
    try {
      await updateTaskStatus(userId, task.id, "failed"); // Update the status in the database
      const updatedTask = { ...task, status: "failed" }; // Update local task data
      dispatch(updateTaskAction(updatedTask)); // Update Redux store
      toast.error("Task marked as failed!");
    } catch (error) {
      console.error("Error marking task as failed:", error);
      toast.error("Failed to mark task as failed.");
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  // Open the edit modal for a specific task
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  // Filter and sort tasks based on user selection
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.status === "completed";
    if (filter === "failed") return task.status === "failed";
    return true;
  });

  const sortedTasks = (() => {
    let sorted = [...filteredTasks];
    if (sortOrder === "asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name)); // Sort tasks alphabetically A-Z
    } else if (sortOrder === "desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name)); // Sort tasks alphabetically Z-A
    }
    return sorted;
  })();

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const failedTasks = tasks.filter((task) => task.status === "failed").length;
  const pendingTasks = totalTasks - (completedTasks + failedTasks);

  return (
    <div className="task-list">
      {/* Task Dashboard header and New Task button */}
      <div className="flex flex-row sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold p-1">Task Dashboard</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-2 sm:mt-0 font-bold bg-green-500 text-white px-4 py-2 rounded flex items-center"
        >
          <FiPlus className="mr-2" />
          New Task
        </button>
      </div>

      {/* Dashboard Statistics display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-200 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Total Tasks</h3>
          <p className="text-3xl font-bold text-gray-800">{totalTasks}</p>
        </div>
        <div className="bg-green-200 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Completed Tasks</h3>
          <p className="text-3xl font-bold text-gray-800">{completedTasks}</p>
        </div>
        <div className="bg-yellow-200 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Pending Tasks</h3>
          <p className="text-3xl font-bold text-gray-800">{pendingTasks}</p>
        </div>
        <div className="bg-red-200 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Failed Tasks</h3>
          <p className="text-3xl font-bold text-gray-800">{failedTasks}</p>
        </div>
      </div>

      {/* Filter and Sort controls */}
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

      {/* Task List display */}
      {loading ? (
        <div className="loading-spinner">Loading tasks...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border rounded shadow mb-2 ${
                task.status === "completed"
                  ? "bg-green-100"
                  : task.status === "failed"
                  ? "bg-red-100"
                  : "bg-yellow-100"
              } relative`}
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

      {/* Modals for editing and adding tasks */}
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
