import React, { useState, useEffect } from "react";
import db from "../firebase";

const TodoForm = ({ groupID, onClose }) => {
  //manage state in a functional component
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  //this function handles adding task
  const handleAddTask = () => {
    if (groupID && task) {
      db.collection("groups")
        .doc(groupID)
        .collection("tasks")
        .add({ task })
        .then(() => {
          setMessage("Task added successfully!");
          setTask("");
        })
        .catch((error) => {
          setMessage(`Error adding task: ${error.message}`);
        });
    } else {
      setMessage("Please enter a task");
    }
  };

  //this function handles editing task
  const handleEditTask = (taskId, newTask) => {
    db.collection("groups")
      .doc(groupID)
      .collection("tasks")
      .doc(taskId)
      .update({ task: newTask })
      .then(() => {
        setMessage("Task updated successfully!");
        setEditTaskId(null); // Clear the edit mode after successful update
      })
      .catch((error) => {
        setMessage(`Error updating task: ${error.message}`);
      });
  };

  //this function handles deleting task
  const handleDeleteTask = (taskId) => {
    db.collection("groups")
      .doc(groupID)
      .collection("tasks")
      .doc(taskId)
      .delete()
      .then(() => {
        setMessage("Task deleted successfully!");
      })
      .catch((error) => {
        setMessage(`Error deleting task: ${error.message}`);
      });
  };

  //Fetching data into Firebase
  useEffect(() => {
    const subscribe = db
      .collection("groups")
      .doc(groupID)
      .collection("tasks")
      .onSnapshot((snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      });

    return () => subscribe();
  }, [groupID]);

  return (
    <div>
      <h2>Group ID: {groupID}</h2>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter Task"
      />
      <button onClick={handleAddTask}>Add Task</button>
      <button onClick={onClose}>Close</button>
      <p>{message}</p>
      <h3>Tasks:</h3>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((taskData) => (
            <li key={taskData.id}>
              {editTaskId === taskData.id ? ( // Show input box if editing this task
                <>
                  <input
                    type="text"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                  />
                  <button
                    onClick={() => handleEditTask(taskData.id, editedTask)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  {taskData.task}{" "}
                  <button onClick={() => setEditTaskId(taskData.id)}>Edit</button>{" "}
                  <button onClick={() => handleDeleteTask(taskData.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found.</p>
      )}
    </div>
  );
};

export default TodoForm;
