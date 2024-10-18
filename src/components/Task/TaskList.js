import React, { useEffect, useState } from 'react';
import { fetchTasks, deleteTask as deleteTaskService, updateTaskStatus } from '../../firebase/taskService';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, deleteTask, updateTask as updateTaskAction } from '../../redux/tasksSlice';
import TaskEditForm from './TaskEditForm';
import { toast } from 'react-toastify';

const TaskList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.taskList);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        const loadTasks = async () => {
            setLoading(true); // Set loading to true
            const tasksFromDb = await fetchTasks();
            dispatch(setTasks(tasksFromDb));
            setLoading(false); // Set loading to false
        };

        loadTasks();
    }, [dispatch]);

    const handleDelete = async (id) => {
        setLoading(true); // Set loading to true
        await deleteTaskService(id);
        dispatch(deleteTask(id)); // Update Redux state
        toast.success('Task deleted successfully!'); // Show notification
        setLoading(false); // Set loading to false
    };

    const handleComplete = async (task) => {
        setLoading(true); // Set loading to true
        await updateTaskStatus(task.id, 'completed'); // Update status to completed
        const updatedTask = { ...task, status: 'completed' };
        dispatch(updateTaskAction(updatedTask)); // Update Redux state
        toast.success('Task marked as completed!'); // Show notification
        setLoading(false); // Set loading to false
    };

    const handleFail = async (task) => {
        setLoading(true); // Set loading to true
        await updateTaskStatus(task.id, 'failed'); // Update status to failed
        const updatedTask = { ...task, status: 'failed' };
        dispatch(updateTaskAction(updatedTask)); // Update Redux state
        toast.error('Task marked as failed!'); // Show notification
        setLoading(false); // Set loading to false
    };

    const handleEdit = (task) => {
        setEditingTask(task); // Set the task to be edited
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.status === 'completed';
        if (filter === 'failed') return task.status === 'failed';
        return true; // show all tasks if filter is 'all'
    });

    const sortedTasks = filteredTasks.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name); // Sort by name in ascending order
        } else {
            return b.name.localeCompare(a.name); // Sort by name in descending order
        }
    });

    return (
        <div className="task-list">
            <h2>Your Tasks</h2>

            <div className="filter-sort-controls">
                <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                    <option value="all">All Tasks</option>
                    <option value="completed">Completed Tasks</option>
                    <option value="failed">Failed Tasks</option>
                </select>
                <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                    <option value="asc">Sort A-Z</option>
                    <option value="desc">Sort Z-A</option>
                </select>
            </div>

            {editingTask && (
                <div className="edit-form-modal">
                    <TaskEditForm task={editingTask} onClose={() => setEditingTask(null)} />
                </div>
            )}

            {loading ? ( // Show loading spinner or message
                <div className="loading-spinner">Loading tasks...</div>
            ) : (
                <ul>
                    {sortedTasks.map((task) => (
                        <li key={task.id} className={task.status === 'completed' ? 'task-completed' : task.status === 'failed' ? 'task-failed' : 'task-pending'}>
                            {task.name}
                            <button onClick={() => handleComplete(task)} className="btn-complete-task">Complete</button>
                            <button onClick={() => handleFail(task)} className="btn-fail-task">Fail</button>
                            <button onClick={() => handleEdit(task)} className="btn-edit-task">Edit</button>
                            <button onClick={() => handleDelete(task.id)} className="btn-delete-task">Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskList;
