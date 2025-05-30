import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      backgroundColor: "#333",
      color: "white"
    }}>
      <div>
        <Link to="/tasques" style={{ color: "white", marginRight: 20 }}>🗂 Tasques</Link>
        <Link to="/ia" style={{ color: "white" }}>🤖 IA</Link>
      </div>
      <button onClick={handleLogout} style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer"
      }}>
        Tancar sessió
      </button>
    </nav>
  );
}

export default Navbar;
