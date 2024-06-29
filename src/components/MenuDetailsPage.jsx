import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryCard from "./CategoryCard";

const MenuDetailsPage = () => {
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const token = localStorage.getItem("retailertoken");
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/menus/1",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    if (menu) {
      const fetchCategories = async () => {
        const token = localStorage.getItem("retailertoken");
        try {
          const categoriesData = await Promise.all(
            menu.categoryIdList.map(async (categoryId) => {
              const response = await axios.get(
                `http://localhost:8080/api/v1/categories/${categoryId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return response.data;
            })
          );
          setCategories(categoriesData);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchCategories();
    }
  }, [menu]);

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
