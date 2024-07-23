import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../Constants";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (isAuthenticated && user) {
        const token = localStorage.getItem("retailertoken");
        try {
          const response = await axios.get(
            `${backend_url}/users/${user.userId}/restaurants`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.length > 0) {
            setRestaurant(response.data[0]);
          } else {
            setRestaurant(null);
          }
        } catch (error) {
          console.error("Error fetching restaurant data:", error);
          localStorage.removeItem("retailertoken");
          navigate("/login");
        }
      }
    };

    fetchRestaurant();
  }, [isAuthenticated, user, navigate]);

  if (restaurant === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No restaurant registered.
          </h2>
          <p className="text-gray-700 mb-6">
            Please register your restaurant to view the details here.
          </p>
          <button
            onClick={() => navigate("/editprofile")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Register Restaurant
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          className="w-full h-64 object-cover"
          src={`http://localhost:50515/${restaurant.imageUrl}`}
          alt={restaurant.name}
        />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {restaurant.name}
          </h2>
          <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
          <p className="mt-4 text-gray-700">{restaurant.description}</p>
          <div className="mt-4 flex items-center">
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-6.16 3.25L5 12.81 0 8.75l6.9-1 3.1-6.25L13.1 7.75 20 8.75l-5 4.06 1.16 5.44z" />
            </svg>
            <span className="ml-2 text-gray-600">{restaurant.rating}</span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Information
            </h3>
            <p className="text-sm text-gray-600">Phone: {restaurant.phone}</p>
            <p className="text-sm text-gray-600">Email: {restaurant.email}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
            <p className="text-sm text-gray-600">{restaurant.address}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Average Price
            </h3>
            <p className="text-sm text-gray-600">${restaurant.avgPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
