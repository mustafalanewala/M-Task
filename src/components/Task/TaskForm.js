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
  const [customCategory, setCustomCategory] = useState(""); // For custom category
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const dispatch = useDispatch();
  const [user] = useAuthState(auth);

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const categories = ["Work", "Personal", "Study", "Health"]; // Predefined categories

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      name: taskName,
      description,
      category: category === "Other" ? customCategory : category, // Use custom category if "Other" is selected
      dueDate,
    };

    try {
      if (user) {
        setLoading(true); // Set loading to true when starting the task addition process
        const taskId = await addTask(user.uid, newTask);
        dispatch(addTaskAction({ id: taskId, ...newTask }));
        toast.success("Task added successfully!");
        onClose();
        setTaskName("");
        setDescription("");
        setCategory("");
        setCustomCategory("");
        setDueDate("");
      } else {
        console.error("User is not authenticated");
        toast.error("You need to be logged in to add a task.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task: " + error.message);
    } finally {
      setLoading(false); // Reset loading state after task is added
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
        <div className="flex items-center space-x-2">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCustomCategory(""); // Reset custom category input when selecting a predefined category
            }}
            className={`border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-full md:w-38 ${
              category === "Other" ? "sm:w-full md:w-46" : ""
            }`}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          {category === "Other" && (
            <input
              type="text"
              placeholder="Enter Custom Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="border border-gray-300 rounded-lg py-2 px-4 mt-0 w-full sm:w-full md:w-46 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        </div>
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
          className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading} // Disable button when loading
        >
          {loading ? "Adding..." : "Add Task"} {/* Show loading text when task is being added */}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
