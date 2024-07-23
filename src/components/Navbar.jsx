import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { backend_url } from "../Constants";
import axios from "axios";
import navbarlogo from "../images/navbarlogo.jpeg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await axios.get(
            `${backend_url}/users/${user.userId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "retailertoken"
                )}`,
              },
            }
          );
          setUsername(`${response.data.firstName} ${response.data.lastName}`);
        } catch (error) {
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, navigate]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Company Name */}
        <div className="flex items-center">
          <img src={navbarlogo} alt="Logo" className="h-14 mr-2" />{" "}
          {/* Increased logo size */}
          <span className="text-xl font-bold">Resquilicious</span>{" "}
          {/* Adjusted text size */}
        </div>

        {/* Navigation Links and Logout */}
        <div className="flex items-center space-x-4">
          {/* Display username */}
          <a href="/home" className="text-gray-600 hover:text-gray-900">
            Hello, {username}
          </a>
          <a href="/editprofile" className="text-gray-600 hover:text-gray-900">
            Edit Restaurant
          </a>
          <a href="/editmenu" className="text-gray-600 hover:text-gray-900">
            Edit Menu
          </a>
          <a
            href="/restaurantimage"
            className="text-gray-600 hover:text-gray-900"
          >
            Edit Image
          </a>
          <a href="/menu" className="text-gray-600 hover:text-gray-900">
            View Menu
          </a>
          <a href="/order" className="text-gray-600 hover:text-gray-900">
            My Orders
          </a>
          {/* Logout button */}
          <button
            onClick={() => {
              logout();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
