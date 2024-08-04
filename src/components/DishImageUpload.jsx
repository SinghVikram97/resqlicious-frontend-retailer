import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../Constants";

const DishImageUpload = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [selectedDishId, setSelectedDishId] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchRestaurantMenuCategoriesDishes = async () => {
      if (isAuthenticated && user) {
        const token = localStorage.getItem("retailertoken");
        try {
          // Fetch user's restaurant
          const restaurantResponse = await axios.get(
            `${backend_url}/users/${user.userId}/restaurants`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (restaurantResponse.data.length === 0) {
            setRestaurant(null);
          } else {
            const foundRestaurant = restaurantResponse.data[0];
            setRestaurant(foundRestaurant);

            // Fetch menu details for the restaurant
            const menuResponse = await axios.get(
              `${backend_url}/menus/${foundRestaurant.menuId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setMenu(menuResponse.data);

            // Fetch categories for the menu
            const categoriesData = await Promise.all(
              menuResponse.data.categoryIdList.map(async (categoryId) => {
                const categoryResponse = await axios.get(
                  `${backend_url}/categories/${categoryId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                return categoryResponse.data;
              })
            );
            setCategories(categoriesData);

            // Fetch dishes for each category
            const dishesData = await Promise.all(
              categoriesData.flatMap((category) =>
                category.dishIdList.map(async (dishId) => {
                  const dishResponse = await axios.get(
                    `${backend_url}/dishes/${dishId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  return dishResponse.data;
                })
              )
            );
            setDishes(dishesData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          navigate("/login");
        }
      }
    };

    fetchRestaurantMenuCategoriesDishes();
  }, [isAuthenticated, user, navigate]);

  if (restaurant === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No restaurant registered.
          </h2>
          <p className="text-gray-700 mb-6">
            Please register your restaurant to view the menu details.
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

  if (!menu || !dishes.length) {
    return <div className="text-center">Loading...</div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image || !selectedDishId) return;

    const formData = new FormData();
    formData.append("image", image);

    const token = localStorage.getItem("retailertoken");
    try {
      await axios.put(
        `${backend_url}/dishes/${selectedDishId}/dishImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-4">Dishes</h2>
      <div className="grid gap-4">
        {dishes.map((dish) => (
          <div key={dish.id} className="border rounded p-4">
            <h3 className="text-lg font-semibold">{dish.name}</h3>
            <p className="text-gray-700 mb-2">Price: ${dish.price}</p>
            {dish.imageUrl ? (
              <img
                src={`http://localhost:50515/${dish.imageUrl}`}
                alt={dish.name}
                className="mb-4 w-full"
              />
            ) : (
              <p className="text-gray-700 mb-4">No image uploaded</p>
            )}
            <label className="block mb-2">
              <input
                type="radio"
                name="dish"
                value={dish.id}
                onChange={() => setSelectedDishId(dish.id)}
              />
              Select
            </label>
          </div>
        ))}
      </div>
      {selectedDishId && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Upload Image</h3>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img src={preview} alt="Preview" className="mt-4 w-full" />
          )}
          <button
            onClick={handleImageUpload}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Upload Image
          </button>
        </div>
      )}
    </div>
  );
};

export default DishImageUpload;
