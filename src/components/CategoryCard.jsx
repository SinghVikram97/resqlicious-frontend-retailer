import React, { useState, useEffect } from "react";
import axios from "axios";
import DishCard from "./DishCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const CategoryCard = ({ category }) => {
  const { id, name } = category;
  const [expanded, setExpanded] = useState(false);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      const token = localStorage.getItem("retailertoken");
      try {
        const dishesData = await Promise.all(
          category.dishIdList.map(async (dishId) => {
            const response = await axios.get(
              `http://localhost:8080/api/v1/dishes/${dishId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return response.data;
          })
        );
        setDishes(dishesData);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    if (expanded) {
      fetchDishes();
    }
  }, [expanded, category.dishIdList]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={toggleExpanded}
      >
        <h2 className="text-xl font-bold">{name}</h2>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-gray-600 ${expanded ? "transform rotate-180" : ""}`}
        />
      </div>
      {expanded && (
        <div className="p-4">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
