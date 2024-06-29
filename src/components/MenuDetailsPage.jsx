import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryCard from "./CategoryCard";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../Constants";

const MenuDetailsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
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
            // No restaurant registered
            setRestaurant(null);
          } else {
            // Restaurant found, set restaurant details
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
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          navigate("/login");
        }
      }
    };

    fetchRestaurantAndMenu();
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

  if (!menu) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-4">Menu</h2>
      <div className="grid gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default MenuDetailsPage;
