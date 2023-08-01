import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.styles.scss";
import { useAuth } from "../../context-providers/auth-context";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const hasGroupValue = !!localStorage.getItem("group");

  useEffect(() => {
    if (hasGroupValue) {
      navigate("/tasks");
    }
  }, [hasGroupValue, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login({ username, password });
    navigate("/tasks");
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
