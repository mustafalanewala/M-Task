import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { auth } from "../../firebase/firebaseConfig";
import { updateTask } from "../../firebase/taskService";
import { updateTask as updateTaskAction } from "../../redux/tasksSlice";

const TaskEditForm = ({ task, onClose }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState(""); // For custom category
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (task) {
      setTaskName(task.name);
      setDescription(task.description);
      setCategory(task.category);
      setCustomCategory(task.category === "Other" ? task.category : "");
      setDueDate(task.dueDate);
    }
  }, [task]);

  const today = new Date().toISOString().split("T")[0];

  const categories = ["Work", "Personal", "Study", "Health"]; // Predefined categories

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!auth.currentUser) {
        toast.error("User not authenticated");
        return;
      }

      const userId = auth.currentUser.uid;
      const updatedTask = {
        id: task.id,
        name: taskName,
        description,
        category: category === "Other" ? customCategory : category, // Use custom category if "Other" is selected
        dueDate,
        status: task.status,
      };

      try {
        setLoading(true);
        await updateTask(userId, task.id, updatedTask);
        dispatch(updateTaskAction(updatedTask));
        onClose();
      } catch (error) {
        console.error("Error updating task:", error.message);
      } finally {
        setLoading(false);
      }
    },
    [
      task,
      taskName,
      description,
      category,
      customCategory,
      dueDate,
      onClose,
      dispatch,
    ]
  );

  const handleChange = (setter) => (e) => setter(e.target.value);

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
          onChange={handleChange(setTaskName)}
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
          onChange={handleChange(setDescription)}
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
          min={today}
          onChange={handleChange(setDueDate)}
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
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskEditForm;
