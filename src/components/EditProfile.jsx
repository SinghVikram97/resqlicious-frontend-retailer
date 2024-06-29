import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../Constants";

const EditProfile = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState({
    id: "",
    name: "",
    cuisine: "",
    rating: "",
    address: "",
    description: "",
    avgPrice: "",
    phone: "",
    email: "",
  });
  const [isNewRestaurant, setIsNewRestaurant] = useState(false);

  useEffect(() => {
    const fetchUserRestaurants = async () => {
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
          if (response.data.length === 0) {
            setIsNewRestaurant(true);
          } else {
            setRestaurant(response.data[0]);
          }
        } catch (error) {
          console.error("Error fetching user restaurants:", error);
          localStorage.removeItem("retailertoken");
          navigate("/login");
        }
      }
    };

    fetchUserRestaurants();
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prevRestaurant) => ({
      ...prevRestaurant,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("retailertoken");
    try {
      if (isNewRestaurant) {
        await axios.post(
          `${backend_url}/restaurants`,
          { ...restaurant, userId: user.userId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Restaurant added successfully!");
      } else {
        await axios.put(
          `${backend_url}/restaurants/${restaurant.id}`,
          restaurant,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert("Restaurant updated successfully!");
      }
    } catch (error) {
      console.error("Error saving restaurant data:", error);
      alert("Failed to save restaurant. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isNewRestaurant ? "Add Restaurant" : "Edit Restaurant"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={restaurant.name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Cuisine</label>
            <input
              type="text"
              name="cuisine"
              value={restaurant.cuisine}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rating</label>
            <input
              type="number"
              name="rating"
              value={restaurant.rating}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="5"
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={restaurant.address}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={restaurant.description}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Average Price</label>
            <input
              type="number"
              name="avgPrice"
              value={restaurant.avgPrice}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={restaurant.phone}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={restaurant.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isNewRestaurant ? "Add Restaurant" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
