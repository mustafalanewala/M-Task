import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteTask,
  updateTask as updateTaskAction,
  archiveTask,
} from "../../redux/tasksSlice";
import {
  deleteTask as deleteTaskService,
  updateTaskStatus,
  archiveTask as archiveTaskService,
} from "../../firebase/taskService";
import { toast } from "react-toastify";
import { FiEdit, FiTrash, FiCheck, FiXCircle  } from "react-icons/fi";
import { MdArchive } from "react-icons/md";

import { auth } from "../../firebase/firebaseConfig";

const TaskCard = ({ task, setEditingTask, setShowEditModal }) => {
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = async (id) => {
    const userId = auth.currentUser.uid;
    try {
      await deleteTaskService(userId, id);
      dispatch(deleteTask(id));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  const handleArchive = async (taskId) => {
    const userId = auth.currentUser.uid;
    try {
      await archiveTaskService(userId, taskId);
      dispatch(archiveTask(taskId));
      toast.success("Task archived successfully!");
    } catch (error) {
      toast.error("Failed to archive task.");
    }
  };

  const handleComplete = async (task) => {
    const userId = auth.currentUser.uid;
    try {
      await updateTaskStatus(userId, task.id, "completed");
      const updatedTask = { ...task, status: "completed" };
      dispatch(updateTaskAction(updatedTask));
      toast.success("Task marked as completed!");
    } catch (error) {
      toast.error("Failed to mark task as completed.");
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
        <div className="flex justify-between font-semibold cursor-pointer">
          <p className="">{task.name}</p>
          <div className="flex gap-6">
            {/* {" "} */}
            {/* <p>Created On: {task.createdDate}</p> */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleArchive(task.id);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              <MdArchive size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowDetails(false)}
            >
              <FiXCircle size={25} />
            </button>
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
              {task.status === "completed" ? (
                <span className="text-green-600 font-semibold">Completed</span>
              ) : task.status === "failed" ? (
                <span className="text-red-600 font-semibold">Failed</span>
              ) : (
                <span className="text-yellow-600 font-semibold">
                  In Progress
                </span>
              )}
            </p>
            <div className="flex space-x-2">
              {task.status !== "completed" && (
                <button
                  onClick={() => handleComplete(task)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-200"
                >
                  <FiCheck size={20} />
                  <span>Completed</span>
                </button>
              )}
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
