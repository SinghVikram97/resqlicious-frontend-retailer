// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../src/components/ProtectedRoute";
import { useAuth } from "./components/AuthContext";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Logout from "./components/Logout";
import Navbar from "./components/Navbar";
import EditProfile from "./components/EditProfile";
import EditMenu from "./components/EditMenu";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route
          path="/editprofile"
          element={<ProtectedRoute element={EditProfile} />}
        />
        <Route
          path="/editmenu"
          element={<ProtectedRoute element={EditMenu} />}
        />
        <Route path="/logout" element={<ProtectedRoute element={Logout} />} />
      </Routes>
    </Router>
  );
};

export default App;
