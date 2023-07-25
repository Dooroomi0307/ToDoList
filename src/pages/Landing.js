import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom';
import db from "../firebase.js";
import TodoForm from "./TodoForm";

const Landing = () => {
  const [groupID, setGroupID] = useState("");
  const [message, setMessage] = useState("");

  //this function handles group creation
  const handleCreateGroup = () => {
    if (groupID) {
      // Check if the groupID already exists
      db.collection("groups")
        .doc(groupID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // If Group already exists
            setMessage(`Please choose a different group ID.`);
          } else {
            // If Group does not exists
            db.collection("groups")
              .doc(groupID)
              .set({ groupID: groupID })
              .then(() => {
                setMessage(`Group "${groupID}" has been created`);
                openTodoFormWindow();
              })
              .catch((error) => {
                setMessage(`Error creating group: ${error.message}`);
              });
          }
        })
        .catch((error) => {
          setMessage(`Error checking group: ${error.message}`);
        });
    } else {
      //Prevent null
      setMessage("Please enter a group ID");
    }
  };

  //this function handles group joining 
  const handleJoinGroup = () => {
    if (groupID) {
      db.collection("groups")
        .doc(groupID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            openTodoFormWindow();
          } else {
            setMessage(`Group "${groupID}" does not exist`);
          }
        })
        .catch((error) => {
          setMessage(`Error joining group: ${error.message}`);
        });
    } else {
      //Prevent null
      setMessage("Please enter a group ID");
    }
  };

  //this function opens group's to-do list
  const openTodoFormWindow = () => {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      //className = 'todo-form'
      newWindow.document.title = "To-Do Form";
      newWindow.document.body.innerHTML = "<div id='todo-form'></div>";

      const todoFormContainer = newWindow.document.getElementById("todo-form");

      //renders TodoForm page
      ReactDOM.render(
        <TodoForm
          groupID={groupID}
          onClose={() => newWindow.close()}
        />,
        todoFormContainer
      );
    }
  };

  return (
    <div>
      <h1>Welcome</h1>
      <input
        type="text"
        value={groupID}
        onChange={(e) => setGroupID(e.target.value)}
        placeholder="Enter Group ID"
      />
      <br />
      <button onClick={handleCreateGroup}>Create Group</button>
      <button onClick={handleJoinGroup}>Join Group</button>
      <p>{message}</p>
    </div>
  );
};

export default Landing;
