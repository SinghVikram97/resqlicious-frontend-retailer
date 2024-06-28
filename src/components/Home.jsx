import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const token = localStorage.getItem("retailertoken");
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/restaurants/1",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRestaurant(response.data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        localStorage.removeItem("retailertoken");
        navigate("/login");
      }
    };

    fetchRestaurant();
  }, [navigate]);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          className="w-full h-64 object-cover"
          src="https://via.placeholder.com/400x300"
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
