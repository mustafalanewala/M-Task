import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask, updateTask as updateTaskAction, archiveTask } from "../../redux/tasksSlice";
import { deleteTask as deleteTaskService, updateTaskStatus, archiveTask as archiveTaskService } from "../../firebase/taskService";
import { toast } from "react-toastify";
import { FiEdit, FiTrash, FiArchive } from "react-icons/fi";
import { auth } from "../../firebase/firebaseConfig";

const TaskCard = ({ task, setEditingTask, setShowEditModal }) => {
  const dispatch = useDispatch();

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

  const handleFail = async (task) => {
    const userId = auth.currentUser.uid;
    try {
      await updateTaskStatus(userId, task.id, "failed");
      const updatedTask = { ...task, status: "failed" };
      dispatch(updateTaskAction(updatedTask));
      toast.error("Task marked as failed!");
    } catch (error) {
      toast.error("Failed to mark task as failed.");
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

  return (
    <div className={`p-4 border rounded shadow mb-2 ${task.status === "completed" ? "bg-green-100" : task.status === "failed" ? "bg-red-100" : "bg-yellow-100"} relative`}>
      <h3 className="text-lg font-semibold">{task.name}</h3>
      <p>{task.description}</p>
      <p><strong>Category:</strong> {task.category}</p>
      <p><strong>Due Date:</strong> {task.dueDate}</p>
      <div className="absolute top-2 right-2 space-x-2 flex">
        <button onClick={() => { setEditingTask(task); setShowEditModal(true); }} className="text-yellow-600 hover:text-yellow-800">
          <FiEdit size={20} />
        </button>
        <button onClick={() => handleDelete(task.id)} className="text-gray-600 hover:text-gray-800">
          <FiTrash size={20} />
        </button>
        <button onClick={() => handleArchive(task.id)} className="text-blue-600 hover:text-blue-800">
          <FiArchive size={20} />
        </button>
      </div>
      <div className="flex space-x-2 mt-2 text-sm font-semibold">
        <button onClick={() => handleComplete(task)} className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-200">
          Mark as Completed
        </button>
        <button onClick={() => handleFail(task)} className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-200">
          Mark as Failed
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
