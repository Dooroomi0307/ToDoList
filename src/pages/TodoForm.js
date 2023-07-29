import React, { useState, useEffect } from "react"
import db from "../firebase"
import "../elements/TodoForm.css"
import { CgMathPlus,CgTrash, CgPen, CgHomeAlt} from "react-icons/cg";

const TodoForm = ({ groupID, onClose }) => {
  //manage state in a functional component
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");

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

  //this function handles adding task
  const handleAddTask = () => {
    if (groupID && task) {
      db.collection("groups")
        .doc(groupID)
        .collection("tasks")
        .add({ task })
        .then(() => {
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
      })
      .catch((error) => {
        setMessage(`Error deleting task: ${error.message}`);
      });
  };

  const handleGoBack = () => {
    onClose(); // Close the current TodoForm (go back to Landing component)
  };

  

  return (
    <div className="page-container">
      {/* The "page-container" wraps the whole page */}
      <button className="home-button" onClick={handleGoBack}><CgHomeAlt/></button>
      <div className="main-container">
          <div className="group-name-container">
            <h2 className="group-name">{groupID}</h2>
          </div>
          
            <div className="search-container">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter Task"
          />
          <button onClick={handleAddTask}>Add Task</button>
          <p>{message}</p>
          </div>
          <div className="todo-container">
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
                      <button className="edit-button" onClick={() => setEditTaskId(taskData.id)}><CgPen /></button>{" "}
                      <button className="delete-button" onClick={() => handleDeleteTask(taskData.id)}><CgTrash /></button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default TodoForm;
