import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../Constants";

const MyOrders = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchRestaurantAndOrders = async () => {
      if (isAuthenticated && user) {
        const token = localStorage.getItem("retailertoken"); // Change token name if needed

        try {
          // Fetch restaurant owned by the user
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

            // Fetch orders for the restaurant
            const ordersResponse = await axios.get(
              `${backend_url}/restaurants/${foundRestaurant.id}/orders`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const ordersData = ordersResponse.data;
            setOrders(ordersData);

            // Fetch dish details for each order
            const orderDetailsPromises = ordersData.map(async (order) => {
              const dishDetailsPromises = Object.keys(order.dishQuantities).map(
                async (dishId) => {
                  const dishResponse = await axios.get(
                    `${backend_url}/dishes/${dishId}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  const dishData = dishResponse.data;
                  return {
                    id: dishId,
                    name: dishData.name,
                    price: dishData.price,
                    quantity: order.dishQuantities[dishId],
                    description: dishData.description,
                  };
                }
              );

              const dishes = await Promise.all(dishDetailsPromises);
              return {
                ...order,
                dishes,
              };
            });

            const allOrderDetails = await Promise.all(orderDetailsPromises);
            setOrderDetails(allOrderDetails);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          navigate("/login"); // Redirect to login if there's an error
        }
      }
    };

    fetchRestaurantAndOrders();
  }, [isAuthenticated, user, navigate]);

  if (restaurant === null) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md bg-white rounded-lg shadow-lg overflow-hidden p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No restaurant registered.
          </h2>
          <p className="text-gray-700 mb-6">
            Please register your restaurant to view the orders.
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

  if (orderDetails.length === 0) {
    return <div className="text-center py-8">No orders found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orderDetails.map((order) => (
        <div
          key={order.id}
          className="mb-6 bg-white rounded-lg shadow-lg overflow-hidden p-6"
        >
          <h3 className="text-lg font-bold mb-2">Order #{order.id}</h3>
          <p className="text-gray-600 mb-2">Pickup Time: {order.pickuptime}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {order.dishes.map((dish) => (
              <div key={dish.id} className="p-4 border rounded-lg">
                <p className="text-lg font-semibold">{dish.name}</p>
                <p className="text-gray-700 mb-2">Quantity: {dish.quantity}</p>
                <p className="text-gray-700 mb-2">Price: ${dish.price}</p>
                <p className="text-gray-700">{dish.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
