import React from "react";

const DishCard = ({ dish }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
      <div className="flex p-4 items-center justify-between">
        <div className="flex-grow">
          <h3 className="text-lg font-bold">{dish.name}</h3>
          <p className="text-gray-600 mb-2">${dish.price}</p>
          <p className="text-gray-700">{dish.description}</p>
          <p className="text-gray-700">Quantity: {dish.quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
