import db from "../firebase.js"
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import handleSubmit from '../elements/handleSubmit.js';

//Redner To-Do list
const Todo = () => {
  const dataRef = useRef()
 
  const submithandler = (e) => {
    e.preventDefault()
    handleSubmit(dataRef.current.value)
    dataRef.current.value = ""
  }
 
  return (
    <div className="App">
      <h2>To-Do</h2>
      <form onSubmit={submithandler}>
        <input type= "text" ref={dataRef} />
        <button type = "submit">Save</button>
      </form>
    </div>
  );
};
export default Todo;