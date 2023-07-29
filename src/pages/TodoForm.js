import React, { useState, useEffect } from "react";
import db from "../firebase";
import "../elements/TodoForm.css";
import { CgMathPlus, CgTrash, CgPen, CgHomeAlt } from "react-icons/cg";
import { BiSolidSave } from "react-icons/bi";

const TodoForm = ({ groupID, onClose }) => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [note, setNote] = useState("");

  //Fetch Firebase data
  //Retrive collectionID 'groups' and its sub collection 'tasks'.
  //groupID (=doc.id) is going to be used to keyword for directs specific document ID.
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

  //Navigate back to landing page
  const handleGoBack = () => {
    onClose();
  };

  //Add task component
  const handleAddTask = () => {
    if (groupID && task) {
      db.collection("groups")
        .doc(groupID)
        .collection("tasks")
        //when user clicks save button, fields 'task', 'note', and 'timestamp' will be saved with unique tasksID.
        .add({ task, completed: false, note: "", timestamp: Date.now() })
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

  //Edit task component
  const handleEditTask = (taskId, newTask) => {
    db.collection("groups")
      .doc(groupID)
      .collection("tasks")
      .doc(taskId)
      //newTask is the new text that is typed in task input box
      .update({ task: newTask })
      //change back to non-editable mode
      .then(() => {
        setEditTaskId(null);
      })
      .catch((error) => {
        setMessage(`Error updating task: ${error.message}`);
      });
  };

  //Delete task component
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

  //Task status component; checked checkbox changes status to completed
  const handleTaskCompletion = (taskId, completed) => {
    const updatedTasks = tasks.map((taskData) =>
      taskData.id === taskId ? { ...taskData, completed: !completed } : taskData
    );

    //when checkbox is cliekd, update task status to 'completed'
    setTasks(updatedTasks);

    db.collection("groups")
      .doc(groupID)
      .collection("tasks")
      .doc(taskId)
      .update({ completed: !completed })
      .catch((error) => {
        setMessage(`Error updating task completion status: ${error.message}`);
      });
  };

  //Open Note component
  const handleTaskClick = (taskId, event) => {
    //gets input from task-text
    if (event.target.classList.contains('task-text')) {
      setSelectedTaskId(taskId);
      //directs selected task's ID
      const selectedTask = tasks.find((taskData) => taskData.id === taskId);
      setNote(selectedTask.note || "");
    }
  };

  //Note save component
  const handleSaveNote = () => {
    db.collection("groups")
      .doc(groupID)
      .collection("tasks")
      .doc(selectedTaskId)
      //update 'note' field in 'task'collection
      .update({ note })
      .then(() => {
        setSelectedTaskId(null);
      })
      .catch((error) => {
        setMessage(`Error saving note: ${error.message}`);
      });
  };

  //Sort tasks by newest to oldest
  //Sort tasks by completed and incompleted
  const compareTimestamps = (taskA, taskB) => {
    return taskB.timestamp - taskA.timestamp;
  };

  const sortedTasks = [
    ...tasks
      .filter((taskData) => !taskData.completed)
      .sort(compareTimestamps),
    ...tasks.filter((taskData) => taskData.completed),
  ];

  //html
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
                  onClick={(event) => handleTaskClick(taskData.id, event)}
                >
                  <div className="task-checkbox">
                    <input
                      type="checkbox"
                      checked={taskData.completed}
                      onChange={() => handleTaskCompletion(taskData.id, taskData.completed)}
                    />
                    <label htmlFor="custom-checkbox"></label> 
                  </div>
                  <div className="task-text">
                    {editTaskId === taskData.id ? (
                      <input
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        onBlur={() => handleEditTask(taskData.id, editedTask)}
                        autoFocus
                      />
                    ) : taskData.completed ? (
                      <del>{taskData.task}</del>
                    ) : (
                      taskData.task
                    )}
                  </div>
                  {taskData.completed ? (
                    <div className="button-group">
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteTask(taskData.id)}
                      >
                        <CgTrash size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="button-group">
                      {editTaskId === taskData.id ? (
                        <></>
                      ) : (
                        <>
                          <button
                            className="edit-button"
                            onClick={() => {
                              setEditTaskId(taskData.id);
                              setEditedTask(taskData.task);
                            }}
                          >
                            <CgPen size={15} />
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteTask(taskData.id)}
                          >
                            <CgTrash size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {selectedTaskId === taskData.id && !taskData.completed && (
                    <div className="note-container">
                      <textarea
                        className="note-input"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Note"
                      />
                      <button className="note-save-button" onClick={handleSaveNote}>
                        <BiSolidSave size={15} />
                      </button>
                    </div>
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
