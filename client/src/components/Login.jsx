import React, { useState } from 'react';
import "../styles/Login.css";
import Navbar from "./Navbar";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    // Perform simple form validation
    if (email.trim() === '' || password.trim() === '') {
      alert('Please fill in all fields');
      return;
    }

    const loginData = {
      email: email,
      password: password,
    };

    axios.post('http://localhost:5000/login', loginData)
      .then((response) => {
        console.log('Login successful:', response.data);
        alert('Login successful!');
      })
      .catch((error) => {
        console.error('There was an error logging in the user:', error);
        alert('There was an error logging in the user. Please try again.');
      });
    console.log('Login successful:', loginData);
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
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
