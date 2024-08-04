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
          {dish.imageUrl ? (
            <img
              src={`http://localhost:50515/${dish.imageUrl}`}
              alt={dish.name}
              className="mb-4 w-32 h-32 object-cover"
            />
          ) : (
            <p className="text-gray-700 mb-4">No image uploaded</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishCard;
