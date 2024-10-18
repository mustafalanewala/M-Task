// src/components/Task/TaskList.js
import React, { useEffect } from 'react';
import { fetchTasks, deleteTask as deleteTaskService } from '../../firebase/taskService';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, deleteTask } from '../../redux/tasksSlice';

const TaskList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks.taskList);

    useEffect(() => {
        const loadTasks = async () => {
            const tasksFromDb = await fetchTasks();
            dispatch(setTasks(tasksFromDb));
        };

        loadTasks();
    }, [dispatch]);

    const handleDelete = async (id) => {
        await deleteTaskService(id);
        dispatch(deleteTask(id)); // Update Redux state
    };

    return (
        <div className="task-list">
            <h2>Your Tasks</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.name}
                        <button onClick={() => handleDelete(task.id)} className="btn-delete-task">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
