import { Route, Routes } from "react-router-dom"
import Nav from "./elements/Nav"
import Todo from "./pages/Todo"
import './elements/App.css'


//Render with navigation
function App() {
  return(
  <>
		<Nav />
			<div className="container">
				<Routes>
        	<Route path="/" element={<Todo />}/>
				</Routes>
			</div>
	</>
  )
};

export default App;