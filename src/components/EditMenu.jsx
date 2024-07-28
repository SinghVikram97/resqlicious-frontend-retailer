import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../Constants";

const EditMenu = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
    description: "", // Added description field
    quantity: "",
  });

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
            await fetchMenuCategories(response.data[0].menuId, token); // Pass menuId to fetchMenuCategories
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

    const fetchMenuCategories = async (menuId, token) => {
      // Accept menuId and token as parameters
      try {
        const menuResponse = await axios.get(`${backend_url}/menus/${menuId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const categoryIdList = menuResponse.data.categoryIdList;

        const categoryFetchPromises = categoryIdList.map(async (categoryId) => {
          const categoryResponse = await axios.get(
            `${backend_url}/categories/${categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return categoryResponse.data;
        });
        const fetchedCategories = await Promise.all(categoryFetchPromises);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching menu categories:", error);
      }
    };

    fetchRestaurant();
  }, [isAuthenticated, user, navigate]);

  const handleCategoryChange = async (e) => {
    const categoryId = parseInt(e.target.value);
    const token = localStorage.getItem("retailertoken");
    try {
      const response = await axios.get(
        `${backend_url}/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const category = response.data;
      const dishes = await Promise.all(
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
      );
      setSelectedCategory({ ...category, dishes });
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategoryName(e.target.value);
  };

  const handleCreateCategory = async () => {
    const token = localStorage.getItem("retailertoken");
    try {
      const response = await axios.post(
        `${backend_url}/categories`,
        { name: newCategoryName, menuId: restaurant.menuId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories([...categories, response.data]);
      setNewCategoryName("");
    } catch (error) {
      console.error("Error creating category:", error);
      alert("Failed to create category. Please try again.");
    }
  };

  const handleNewDishChange = (e) => {
    const { name, value } = e.target;
    setNewDish((prevDish) => ({
      ...prevDish,
      [name]: value,
    }));
  };

  const handleAddDish = async () => {
    const token = localStorage.getItem("retailertoken");
    try {
      const response = await axios.post(
        `${backend_url}/dishes`,
        {
          name: newDish.name,
          price: parseFloat(newDish.price),
          description: newDish.description, // Include description
          categoryId: selectedCategory.id,
          quantity: newDish.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedCategory((prevCategory) => ({
        ...prevCategory,
        dishes: [...prevCategory.dishes, response.data],
      }));
      setNewDish({
        name: "",
        price: "",
        description: "", // Reset description field
        quantity: "",
      });
    } catch (error) {
      console.error("Error adding dish:", error);
      alert("Failed to add dish. Please try again.");
    }
  };

  const handleEditDish = async (dishId, updatedDish) => {
    const token = localStorage.getItem("retailertoken");
    try {
      await axios.put(`${backend_url}/dishes/${dishId}`, updatedDish, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCategory((prevCategory) => ({
        ...prevCategory,
        dishes: prevCategory.dishes.map((dish) =>
          dish.id === dishId ? updatedDish : dish
        ),
      }));
    } catch (error) {
      console.error("Error editing dish:", error);
      alert("Failed to edit dish. Please try again.");
    }
  };

  const EditDishForm = ({ dish, onEdit }) => {
    const [editedDish, setEditedDish] = useState({ ...dish });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedDish((prevDish) => ({
        ...prevDish,
        [name]: value,
      }));
    };

    const saveChanges = () => {
      onEdit(dish.id, editedDish);
    };

    return (
      <div className="mt-4 border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-900">Edit Dish</h3>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={editedDish.name}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={editedDish.price}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={editedDish.quantity}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={editedDish.description}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <button
          onClick={saveChanges}
          className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    );
  };

  if (restaurant === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No restaurant registered.
          </h2>
          <p className="text-gray-700 mb-6">
            Please register your restaurant to manage the menu.
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
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Menu</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Create Category
          </h3>
          <input
            type="text"
            value={newCategoryName}
            onChange={handleNewCategoryChange}
            placeholder="New Category Name"
            className="mt-2 p-2 w-full border rounded"
          />
          <button
            onClick={handleCreateCategory}
            className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Create Category
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Select Category
          </h3>
          <select
            value={selectedCategory ? selectedCategory.id : ""}
            onChange={handleCategoryChange}
            className="mt-2 p-2 w-full border rounded"
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Add New Dish
            </h3>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={newDish.name}
                onChange={handleNewDishChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={newDish.price}
                onChange={handleNewDishChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={newDish.quantity}
                onChange={handleNewDishChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={newDish.description}
                onChange={handleNewDishChange}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            <button
              onClick={handleAddDish}
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add Dish
            </button>

            {selectedCategory.dishes && selectedCategory.dishes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Dishes
                </h3>
                {selectedCategory.dishes.map((dish) => (
                  <EditDishForm
                    key={dish.id}
                    dish={dish}
                    onEdit={handleEditDish}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditMenu;
