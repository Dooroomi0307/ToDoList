import { Route, Routes } from "react-router-dom"
import Nav from "./elements/Nav"

import Landing from "./pages/Landing"
import './elements/App.css'


//Render with navigation
function App() {
  return(
  <>
		<Nav />
			<div className="container">
				<Routes>
					<Route path="" element={<Landing />}/>
				</Routes>
			</div>
	</>
  )
};

export default App;