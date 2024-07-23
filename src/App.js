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
import MenuDetailsPage from "./components/MenuDetailsPage";
import MyOrders from "./components/MyOrders";
import RestaurantImage from "./components/RestaurantImage";

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
        <Route
          path="/menu"
          element={<ProtectedRoute element={MenuDetailsPage} />}
        />
        <Route path="/order" element={<ProtectedRoute element={MyOrders} />} />
        <Route path="/logout" element={<ProtectedRoute element={Logout} />} />
        <Route
          path="/restaurantimage"
          element={<ProtectedRoute element={RestaurantImage} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
