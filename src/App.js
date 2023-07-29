import { Route, Routes } from "react-router-dom"
import {useRef, useEffect, useState} from 'react'
import Nav from "./elements/Nav"
import Landing from "./pages/Landing"
import TodoForm from "./pages/TodoForm"
import Splash from "./pages/Splash"
import "./elements/App.css"

//Render with navigation
function App() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(()=>setLoading(false), 4500);
	})



  return (
    <>
      {loading ? ( // Show the SplashScreen if loading is true
        <Splash />
      ) : (
        <>
          <div className="main">
          </div>
          <Nav />
          <div className="container">
            <Routes>
              <Route path="" element={<Landing />} />
              <Route path="/todo/:groupID" component={TodoForm}/>
            </Routes>
          </div>
        </>
      )}
    </>
  );
}

export default App;