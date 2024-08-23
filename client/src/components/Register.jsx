import React, { useState } from 'react';
import "../styles/Register.css";
import Navbar from "./Navbar";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (username.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const registrationData = {
      username: username,
      email: email,
      password: password,
      accountType: accountType,
    };

    axios.post('http://localhost:5000/register', registrationData)
      .then((response) => {
        console.log('Registration successful:', response.data);
        alert('Registration successful!');
      })
      .catch((error) => {
        console.error('There was an error registering the user:', error);
        alert('There was an error registering the user. Please try again.');
      });
    console.log('Registration successful:', registrationData);
  }

  return (
    <>
      <div className="header">
        <Navbar />
      </div>
      <div className="register-form-container">
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Register</h2>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="accountType">Account Type</label>
            <select
            id="accountType"
            value={accountType}
            onChange={(event) => setAccountType(event.target.value)}
            required
            >
              <option value="">Select an account type</option>
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </div>
          <button type="submit" className="register-button">Register</button>
          <div className="signup-link">
            <p>Already registered? <a href="/login">Log In</a></p>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
