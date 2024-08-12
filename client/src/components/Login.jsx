import React, { useState } from 'react';
import "../styles/Login.css";
import Navbar from "./Navbar";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    // Perform simple form validation
    if (username.trim() === '' || password.trim() === '') {
      alert('Please fill in all fields');
      return;
    }

    // If validation passes, the form will be submitted
    // Here you can add logic to handle form submission (e.g., sending data to the backend)
  }

  return (
    <>
    <div className="header">
      <Navbar/>
    </div>
    <div className="login-form-container">
      <form onSubmit={handleSubmit} action="/login" method="POST" className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        <div className="signup-link">
          <p>Not registered? <a href="/register">Sign up</a></p>
        </div>
      </form>
    </div>
    </>
  );
}

export default Login;
