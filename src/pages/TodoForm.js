import React, { useState, useEffect } from "react";
import db from "../firebase";
import "../elements/TodoForm.css";
import { CgMathPlus, CgTrash, CgPen, CgHomeAlt } from "react-icons/cg";

const TodoForm = ({ groupID, onClose }) => {
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

  const handleAddTask = () => {
    if (groupID && task) {
      db.collection("groups")
        .doc(groupID)
        .collection("tasks")
        .add({ task, completed: false })
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

  const handleEditTask = (taskId, newTask) => {
    db.collection("groups")
      .doc(groupID)
      .collection("tasks")
      .doc(taskId)
      .update({ task: newTask })
      .then(() => {
        setEditTaskId(null);
      })
      .catch((error) => {
        setMessage(`Error updating task: ${error.message}`);
      });
  };

  const handleDeleteTask = (taskId) => {
    db.collection("groups")
      .doc(groupID)
      .collection("tasks")
      .doc(taskId)
      .delete()
      .catch((error) => {
        setMessage(`Error deleting task: ${error.message}`);
      });
  };

  const handleTaskCompletion = (taskId, completed) => {
    // Toggle the completion status
    const updatedTasks = tasks.map((taskData) =>
      taskData.id === taskId ? { ...taskData, completed: !completed } : taskData
    );

    setTasks(updatedTasks);

    // Update the completion status in the database
    db.collection("groups")
      .doc(groupID)
      .collection("tasks")
      .doc(taskId)
      .update({ completed: !completed })
      .catch((error) => {
        setMessage(`Error updating task completion status: ${error.message}`);
      });
  };

  const handleGoBack = () => {
    onClose();
  };

  // Sort tasks based on completion status (complete tasks go to the bottom)
  const sortedTasks = [
    ...tasks.filter((taskData) => !taskData.completed),
    ...tasks.filter((taskData) => taskData.completed),
  ];

  return (
    <div className="page-container">
      <button className="home-button" onClick={handleGoBack}>
        <CgHomeAlt size={30} />
      </button>
      <div className="main-container">
        <div className="group-name-container">
          <h2 className="group-name">{groupID}</h2>
        </div>

        <div className="task-input-container">
          <div className="input-wrapper">
            <input
              className="task-input"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter Task"
            />
            <button className="add-button" onClick={handleAddTask}>
              <CgMathPlus size={20} />
            </button>
          </div>
          <p>{message}</p>
        </div>
        <div className="todo-container">
          {sortedTasks.length > 0 ? (
            <ul className="single-todo">
              {sortedTasks.map((taskData) => (
                <li
                  key={taskData.id}
                  className={taskData.completed ? "completed-task" : ""}
                >
                  <div className="task-checkbox">
                    <input
                      type="checkbox"
                      checked={taskData.completed}
                      onChange={() =>
                        handleTaskCompletion(taskData.id, taskData.completed)
                      }
                    />
                  </div>
                  {editTaskId === taskData.id ? (
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
                      <div className="task-text">
                        {taskData.completed ? (
                          <del>{taskData.task}</del>
                        ) : (
                          taskData.task
                        )}
                      </div>
                      <div className="button-group">
                        <button
                          className="edit-button"
                          onClick={() => setEditTaskId(taskData.id)}
                        >
                          <CgPen size={15} />
                        </button>{" "}
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteTask(taskData.id)}
                        >
                          <CgTrash size={15} />
                        </button>
                      </div>
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
