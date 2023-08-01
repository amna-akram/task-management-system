import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.styles.scss";

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("group");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-title">Task Management System</div>
      <div className="user-info">
        <div className="username">Hello, {username}</div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
