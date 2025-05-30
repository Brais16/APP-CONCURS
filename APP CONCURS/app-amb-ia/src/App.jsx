import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChatIA from "./components/ChatIA";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import TaskManager from "./components/TaskManager";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Recuperar sessió si ja s'ha iniciat abans
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div style={{ fontFamily: "Arial", color: "white" }}>
        {user && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/tasques" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/tasques"
            element={user ? <TaskManager user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/ia"
            element={user ? <ChatIA /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
