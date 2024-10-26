// src/components/Task/TaskEditForm.js
import React, { useState, useEffect } from "react";
import { updateTask } from "../../firebase/taskService";
import { useDispatch } from "react-redux";
import { updateTask as updateTaskAction } from "../../redux/tasksSlice";
import { auth } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";

const TaskEditForm = ({ task, onClose }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (task) {
      setTaskName(task.name);
      setDescription(task.description);
      setCategory(task.category);
      setDueDate(task.dueDate);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = auth.currentUser.uid;
    const updatedTask = {
      id: task.id,
      name: taskName,
      description,
      category,
      dueDate,
      status: task.status,
    };
    try {
      await updateTask(userId, task.id, updatedTask);
      dispatch(updateTaskAction(updatedTask));
      onClose();
      toast.success("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error.message);
      toast.error("Failed to update task: " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Edit Task</h2>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Task Name
        </label>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
          className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">
          Description
        </label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">Category</label>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block text-gray-600 font-medium mb-1">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Update Task
        </button>
      </div>
    </form>
  );
};

export default TaskEditForm;
