import React, { useState } from "react";
import { addTask } from "../../firebase/taskService";
import { useDispatch } from "react-redux";
import { addTask as addTaskAction } from "../../redux/tasksSlice";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";

const TaskForm = ({ onClose }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      name: taskName,
      description,
      category,
      dueDate,
      completed: false,
    };

    try {
      if (user) {
        const taskId = await addTask(user.uid, newTask);
        dispatch(addTaskAction({ id: taskId, ...newTask }));
        toast.success("Task added successfully!");
        onClose();
        setTaskName("");
        setDescription("");
        setCategory("");
        setDueDate("");
      } else {
        console.error("User is not authenticated");
        toast.error("You need to be logged in to add a task.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task: " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
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
          min={today} // Set minimum date to today's date
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
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
