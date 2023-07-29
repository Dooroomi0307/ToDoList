import React, { useState } from "react";
import db from "../firebase.js";
import TodoForm from "./TodoForm";
import "../elements/Landing.css";
import Logo from "../elements/logo-no-background.png";

const Landing = () => {
  const [groupID, setGroupID] = useState("");
  const [message, setMessage] = useState("");
  const [showTodoForm, setShowTodoForm] = useState(false);

  //Create group component
  const handleCreateGroup = () => {
    if (groupID) {
      // Check if the groupID already exists
      db.collection("groups")
        .doc(groupID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            // If Group already exists
            setMessage(`Please choose a different group ID`);
          } else {
            // If Group does not exists
            db.collection("groups")
              .doc(groupID)
              .set({ groupID: groupID })
              .then(() => {
                setMessage(`Group "${groupID}" has been created`);
                setShowTodoForm(true);
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

  //Join group component
  const handleJoinGroup = () => {
    if (groupID) {
      db.collection("groups")
        .doc(groupID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setShowTodoForm(true);
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

  //html
  return (
    <div className="landing-container">
      <div className="todo-container">
      {!showTodoForm && <img src={Logo} alt="Logo" className="logo" />}
      
      {showTodoForm ? (
        <TodoForm
          groupID={groupID}
          onClose={() => setShowTodoForm(false)}
        />
      ) : (
        <div className="group-input-container">
          <input className="group-input"
            type="text"
            value={groupID}
            onChange={(e) => setGroupID(e.target.value)}
            placeholder="Enter Group ID"
          />
          <br />
          <button className="create-button" onClick={handleCreateGroup}>
              Create Group
            </button>
            <button className="join-button" onClick={handleJoinGroup}>
              Join Group
            </button>
          <p className="group-msg">{message}</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default Landing;
