import react from "react";
import './App.css';
import Landing from "../src/pages/Landing";
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Login from "./components/Login";
import Register from "./components/Register";


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
