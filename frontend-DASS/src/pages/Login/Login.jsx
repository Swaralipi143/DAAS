import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("author");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isSignUp ? "/register" : "/login";
    const url = `http://localhost:5000/users${endpoint}`;
    const payload = isSignUp
      ? { name: fullName, email, password, role }
      : { email, password, role };

    try {
      const response = await axios.post(url, payload);
      const { token, user } = response.data;

      // Store token and user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);

      // Navigate based on role
      navigate(user.role === "admin" ? "/admin" : "/");

      // Optional reload for components relying on localStorage
      setTimeout(() => {
        window.location.reload();
      }, 50);
    } catch (error) {
      console.error(`${isSignUp ? "Signup" : "Login"} error:`, error.response?.data || error.message);
      alert(error.response?.data?.message || `${isSignUp ? "Sign up" : "Login"} failed.`);
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>{isSignUp ? "Register as" : "Login as"}</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="login-button">
          {isSignUp ? "Sign Up" : `Login as ${role === "admin" ? "Admin" : "Author"}`}
        </button>
      </form>

      <p className="toggle-text" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp
          ? "Already have an account? Login"
          : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default Login;
