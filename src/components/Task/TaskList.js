import React, { useEffect, useState } from "react";
import {
  fetchTasks,
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
      setLoading(true);
      const tasksFromDb = await fetchTasks();
      dispatch(setTasks(tasksFromDb));
      setLoading(false);
    };

    loadTasks();
  }, [dispatch]);

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteTaskService(id);
    dispatch(deleteTask(id));
    toast.success("Task deleted successfully!");
    setLoading(false);
  };

  const handleComplete = async (task) => {
    setLoading(true);
    await updateTaskStatus(task.id, "completed");
    const updatedTask = { ...task, status: "completed" };
    dispatch(updateTaskAction(updatedTask));
    toast.success("Task marked as completed!");
    setLoading(false);
  };

  const handleFail = async (task) => {
    setLoading(true);
    await updateTaskStatus(task.id, "failed");
    const updatedTask = { ...task, status: "failed" };
    dispatch(updateTaskAction(updatedTask));
    toast.error("Task marked as failed!");
    setLoading(false);
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
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const failedTasks = tasks.filter(task => task.status === "failed").length;
  const pendingTasks = totalTasks - (completedTasks + failedTasks);

  return (
    <div className="task-list">
      <h2 className="text-2xl font-bold mb-4">Task Dashboard</h2>

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
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
          >
            Add New Task
          </button>
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
              } shadow`}
            >
              <h3 className="text-lg font-semibold">{task.name}</h3>
              <p>{task.description}</p>
              <p>
                <strong>Category:</strong> {task.category}
              </p>
              <p>
                <strong>Due Date:</strong> {task.dueDate}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleComplete(task)}
                  className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 transition duration-200"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleFail(task)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition duration-200"
                >
                  Fail
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-700 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-700 transition duration-200"
                >
                  Delete
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
