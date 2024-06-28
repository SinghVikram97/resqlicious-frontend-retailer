import React, { useState, useEffect } from "react";
import axios from "axios";

const EditMenu = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("retailertoken");
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const categoryId = parseInt(e.target.value);
    const token = localStorage.getItem("retailertoken");
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/categories/${categoryId}`,
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
            `http://localhost:8080/api/v1/dishes/${dishId}`,
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

  const handleNewDishChange = (e) => {
    const { name, value } = e.target;
    setNewDish((prevDish) => ({
      ...prevDish,
      [name]: value,
    }));
  };

  const handleCreateCategory = async () => {
    const token = localStorage.getItem("retailertoken");
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/categories",
        { name: newCategoryName, menuId: 1 },
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

  const handleAddDish = async () => {
    const token = localStorage.getItem("retailertoken");
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/dishes`,
        {
          name: newDish.name,
          price: parseFloat(newDish.price),
          categoryId: selectedCategory.id,
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
      });
    } catch (error) {
      console.error("Error adding dish:", error);
      alert("Failed to add dish. Please try again.");
    }
  };

  const handleEditDish = async (dishId, updatedDish) => {
    const token = localStorage.getItem("retailertoken");
    try {
      await axios.put(
        `http://localhost:8080/api/v1/dishes/${dishId}`,
        updatedDish,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
            <option value="" disabled>
              Select a category
            </option>
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
              Dishes in {selectedCategory.name}
            </h3>
            {selectedCategory.dishes && selectedCategory.dishes.length > 0 ? (
              selectedCategory.dishes.map((dish) => (
                <EditDishForm
                  key={dish.id}
                  dish={dish}
                  onEdit={handleEditDish}
                />
              ))
            ) : (
              <p>No dishes found in this category.</p>
            )}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Add Dish</h3>
              <input
                type="text"
                name="name"
                value={newDish.name}
                onChange={handleNewDishChange}
                placeholder="Dish Name"
                className="mt-2 p-2 w-full border rounded"
              />
              <input
                type="number"
                name="price"
                value={newDish.price}
                onChange={handleNewDishChange}
                placeholder="Dish Price"
                className="mt-2 p-2 w-full border rounded"
              />
              <button
                onClick={handleAddDish}
                className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Add Dish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EditDishForm = ({ dish, onEdit }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedDish, setEditedDish] = useState(dish);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDish((prevDish) => ({
      ...prevDish,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      await onEdit(dish.id, editedDish);
      setEditMode(false);
    } catch (error) {
      console.error("Error editing dish:", error);
      alert("Failed to edit dish. Please try again.");
    }
  };

  return (
    <div className="mb-4">
      {!editMode && (
        <div className="flex items-center justify-between border-b border-gray-300 pb-2">
          <div>
            <p className="font-semibold">{dish.name}</p>
            <p className="text-gray-600">${dish.price}</p>
          </div>
          <div>
            <button onClick={handleEditToggle} className="text-blue-500">
              Edit
            </button>
          </div>
        </div>
      )}
      {editMode && (
        <div className="flex items-center justify-between border-b border-gray-300 pb-2">
          <div>
            <input
              type="text"
              name="name"
              value={editedDish.name}
              onChange={handleInputChange}
              className="border rounded p-2 mr-2"
            />
            <input
              type="number"
              name="price"
              value={editedDish.price}
              onChange={handleInputChange}
              className="border rounded p-2 mr-2"
            />
          </div>
          <div>
            <button onClick={handleEditSubmit} className="text-green-500">
              Save
            </button>
            <button onClick={handleEditToggle} className="text-gray-500 ml-2">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditMenu;
