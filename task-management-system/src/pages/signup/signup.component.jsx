import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

import "./signup.styles.scss";
import { addUser } from "../../utils/db";

const Signup = () => {
  const navigate = useNavigate();
  const hasGroupValue = !!localStorage.getItem("group");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    groupId: "",
  });

  useEffect(() => {
    if (hasGroupValue) {
      navigate("/tasks");
    }
  }, [hasGroupValue, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    try {
      await addUser(formData);
      toast.success("User Created Successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/");
    } catch {
      toast.error("An Error Occured While Creating This User!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Task Management System</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="group">Group:</label>
            <select
              id="groupId"
              name="groupId"
              value={formData.group}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Group</option>
              <option value="1">Marketing</option>
              <option value="2">Development</option>
            </select>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
