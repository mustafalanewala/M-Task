import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { unarchiveTask } from "../redux/tasksSlice";
import { auth } from "../firebase/firebaseConfig";
import { unarchiveTask as unarchiveTaskService } from "../firebase/taskService";
import { toast } from "react-toastify";

const Archived = () => {
  const dispatch = useDispatch();
  const archivedTasks = useSelector((state) => state.tasks.archivedTasks);

  const handleUnarchive = async (taskId) => {
    const userId = auth.currentUser.uid;
    try {
      await unarchiveTaskService(userId, taskId);
      dispatch(unarchiveTask(taskId));
      toast.success("Task unarchived successfully!");
    } catch (error) {
      toast.error("Failed to unarchive task.");
    }
  };

  return (
    <div className="archive-page">
      <h2 className="text-xl sm:text-2xl font-bold p-1 mb-6">Notifications</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {archivedTasks.map((task) => (
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
            {/* Task Details */}
            <h3 className="text-lg font-semibold">{task.name}</h3>
            <p>{task.description}</p>
            <p>
              <strong>Category:</strong> {task.category}
            </p>
            <p>
              <strong>Due Date:</strong> {task.dueDate}
            </p>

            {/* Unarchive Button */}
            <button
              onClick={() => handleUnarchive(task.id)}
              className="bg-blue-500 text-white p-2 rounded mt-4 w-full hover:bg-blue-600"
            >
              Unarchive
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archived;
