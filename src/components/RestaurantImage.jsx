import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../Constants";

const RestaurantImage = () => {
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
    imageUrl: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
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
            console.log(response.data[0].imageUrl);
            setPreview(response.data[0].imageUrl || null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    const token = localStorage.getItem("retailertoken");
    try {
      await axios.put(
        `${backend_url}/restaurants/${restaurant.id}/restaurantImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const response = await axios.get(
        `${backend_url}/restaurants/${restaurant.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRestaurant(response.data);
      console.log(response.data.imageUrl);
      setPreview(response.data.imageUrl || null);
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };
  const isBlobUrl = preview && preview.startsWith("blob:");
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isNewRestaurant ? "Add Restaurant" : "Edit Restaurant Image"}
        </h2>
        <form onSubmit={handleImageUpload}>
          <div className="mb-4">
            <label className="block text-gray-700">Restaurant Name</label>
            <p className="mt-1 p-2 w-full border rounded">{restaurant.name}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Current Image</label>
            {preview ? (
              <img
                src={isBlobUrl ? preview : `http://localhost:50515/${preview}`}
                alt="Restaurant"
                className="mt-1 w-full"
              />
            ) : (
              <p className="mt-1 p-2 w-full border rounded">Photo not added</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Upload New Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Upload Image
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantImage;
