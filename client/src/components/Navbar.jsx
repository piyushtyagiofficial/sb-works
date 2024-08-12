import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar(props) {
  return (
    <nav>
      <h1 className="title-company">SB Works</h1>
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/login">Log In</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
