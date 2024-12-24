import React, { useState } from "react";
import { FiCheck, FiEdit, FiTrash, FiXCircle } from "react-icons/fi";
import { MdArchive } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  archiveTask as archiveTaskService,
  deleteTask as deleteTaskService,
  updateTaskStatus,
} from "../../firebase/taskService";
import {
  archiveTask,
  deleteTask,
  updateTask as updateTaskAction,
} from "../../redux/tasksSlice";

import { auth } from "../../firebase/firebaseConfig";

const TaskCard = ({ task, setEditingTask, setShowEditModal }) => {
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);

  // Handle task deletion
  const handleDelete = async (id) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      await deleteTaskService(userId, id); // Delete task from Firebase
      dispatch(deleteTask(id)); // Remove task from Redux store
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle task archiving
  const handleArchive = async (taskId) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      await archiveTaskService(userId, taskId);
      dispatch(archiveTask(taskId));
    } catch (error) {
      console.error("Error archiving task:", error);
    }
  };

  // Mark task as completed
  const handleComplete = async (task) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      await updateTaskStatus(userId, task.id, "completed"); // Update Firebase
      const updatedTask = { ...task, status: "completed" }; // Create updated task
      dispatch(updateTaskAction(updatedTask)); // Update Redux store
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  return (
    <>
      {/* Task Summary */}
      <div
        className={`p-4 border rounded shadow mb-2 ${
          task.status === "completed"
            ? "bg-green-100"
            : task.status === "failed"
            ? "bg-red-100"
            : "bg-yellow-100"
        } relative`}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex justify-between items-center">
          <p className="font-semibold">{task.name}</p>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering modal
              handleArchive(task.id);
            }}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Archive Task"
          >
            <MdArchive size={22} />
          </button>
        </div>
      </div>

      {/* Task Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            {/* Close Modal Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowDetails(false)}
              aria-label="Close Modal"
            >
              <FiXCircle size={25} />
            </button>

            {/* Task Details */}
            <h3 className="text-2xl font-bold mb-4">{task.name}</h3>
            <p className="mb-2">
              <strong>Description:</strong> {task.description}
            </p>
            <p className="mb-2">
              <strong>Category:</strong> {task.category}
            </p>
            <p className="mb-2">
              <strong>Due Date:</strong> {task.dueDate}
            </p>
            <p className="mb-4">
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  task.status === "completed"
                    ? "text-green-600"
                    : task.status === "failed"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {task.status}
              </span>
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {/* Complete Task Button */}
              {task.status !== "completed" && (
                <button
                  onClick={() => handleComplete(task)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-200"
                >
                  <FiCheck size={20} />
                  <span>Completed</span>
                </button>
              )}

              {/* Edit Task Button */}
              <button
                onClick={() => {
                  setEditingTask(task);
                  setShowEditModal(true);
                  setShowDetails(false);
                }}
                className={`flex-1 flex items-center justify-center space-x-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700 transition duration-200 ${
                  task.status === "completed"
                    ? "cursor-not-allowed opacity-70"
                    : ""
                }`}
                disabled={task.status === "completed"}
              >
                <FiEdit size={20} />
                <span>Edit</span>
              </button>

              {/* Delete Task Button */}
              <button
                onClick={() => {
                  handleDelete(task.id);
                  setShowDetails(false);
                }}
                className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-200"
              >
                <FiTrash size={20} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
