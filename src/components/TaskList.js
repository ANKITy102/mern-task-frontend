import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import TaskForm from './TaskForm'
import Task from './Task';
import axios from "axios";
import { URL } from '../App';
const TaskList = () => {

    const [tasks, setTasks] = useState([]);
    const [completedTask, setCompletedTasks] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        completed: false 
    })
    const { name } = formData;
    const [isEditing, setIsEditing] = useState(false)
    const [taskID, setTaskID] = useState("");
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }




    const createTask = async (e) => {
        e.preventDefault()
        const { name } = formData;
        if (name === "") {
            return toast.error("Input field cannot be empty");
        }
        try {
            await axios.post(`https://mern-task-manager-app-api-6yvz.onrender.com/api/tasks`, formData)
            setFormData({ ...formData, name: "" });
            getTasks();
            toast.success("task added successfully");
        } catch (err) {
            toast.error(err.message)
        }
        console.log(formData)
    }

    const getTasks = async () => {
        console.log(URL)
        setisLoading(true)
        try {
            const { data } = await axios.get(`https://mern-task-manager-app-api-6yvz.onrender.com/api/tasks`);
            // const response = await fetch("https://mern-task-manager-app-api-6yvz.onrender.com/api/tasks", {
            //     method: "GET",
            //     headers: {
            //         "Content-Type": "application/json"
            //     }
            // })
            // console.log(data)
            setTasks(data)

            setisLoading(false);
        }
        catch (error) {
            toast.error(error.message)
            console.log(error)
            setisLoading(false)
        }
    }

    useEffect(() => {
        getTasks();
    }, [])
    useEffect(() => {
        const cTask = tasks.filter((task) => {
            return task.completed === true
        })
        setCompletedTasks(cTask)
    }, [tasks])
    const deleteTask = async (id) => {
        try {
            await axios.delete(`https://mern-task-manager-app-api-6yvz.onrender.com/api/tasks/${id}`);
            getTasks()
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const getSingleTask = async (task) => {
        setFormData({ name: task.name, completed: false })
        setTaskID(task._id);
        setIsEditing(true);
    }
    const updateTask = async (e) => {
        e.preventDefault();
        if (name === "") {
            return toast.error("Input field cannot be empty.")
        }
        try {
            await axios.patch(`https://mern-task-manager-app-api-6yvz.onrender.com/api/tasks/${taskID}`, formData)
            setFormData({ ...formData, name: "" })
            setIsEditing(false)
            getTasks()
        } catch (error) {

        }
    }
    const setToComplete = async (task) => {
        const newFormData = {
            completed: true
        }
        try {
            await axios.patch(`https://mern-task-manager-app-api-6yvz.onrender.com/api/tasks/${task._id}`, newFormData)
            getTasks()
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <h2>Task Manager</h2>
            <TaskForm name={name} updateTask={updateTask} handleInputChange={handleInputChange} createTask={createTask} isEditing={isEditing} />

            {tasks.length > 0 && (<div className="--flex-between --pb">
                <p><b>Total Task:</b> {tasks.length}  </p>
                <p><b>Completed Task:</b> {completedTask.length}</p>
            </div>)}
            <hr />
            {
                isLoading && (<div className="--flex-center">
                    <h2>Loading....</h2>
                </div>)

            }
            {
                !isLoading && tasks.length === 0 ? (<p className="--py">No task added. Please add a task</p>) : (
                    <>
                        {tasks.map((task, index) => {
                            return (<Task
                                key={task._id}
                                task={task}
                                index={index}
                                deleteTask={deleteTask}
                                getSingleTask={getSingleTask}
                                setToComplete={setToComplete}
                            />)
                        })}</>
                )
            }

        </div>
    )
}

export default TaskList
