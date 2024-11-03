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
  const tasks = useSelector((state) => state.tasks.taskList);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      if (auth.currentUser) {
        setLoading(true);
        const tasksFromDb = await fetchUserTasks(auth.currentUser.uid);

        const updatedTasks = tasksFromDb.map((task) => {
          const dueDate = new Date(task.dueDate);
          const currentDate = new Date();
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

  const handleDelete = async (id) => {
    const userId = auth.currentUser.uid;
    setLoading(true);
    try {
      await deleteTaskService(userId, id);
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
    const userId = auth.currentUser.uid;
    try {
      await updateTaskStatus(userId, task.id, "completed");
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
    const userId = auth.currentUser.uid;
    try {
      await updateTaskStatus(userId, task.id, "failed");
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
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const failedTasks = tasks.filter((task) => task.status === "failed").length;
  const pendingTasks = totalTasks - (completedTasks + failedTasks);

  return (
    <div className="task-list">
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

      {/* Dashboard Statistics */}
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

      {/* Filter and Sort Controls */}
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
            <option value="default">Sort By</option>{" "}
            {/* Added default option */}
            <option value="asc">Sort A-Z</option>
            <option value="desc">Sort Z-A</option>
          </select>
        </div>
      </div>

      {/* Task List */}
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
