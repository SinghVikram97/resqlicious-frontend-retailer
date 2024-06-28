// Register.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { backend_url } from "../Constants";
import { MDBIcon } from "mdb-react-ui-kit";
import logo from "../images/logo.png";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    // Redirect to home if user is already authenticated
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const user = {
      firstName,
      lastName,
      email,
      password,
      about,
      role: "ROLE_USER",
    };

    try {
      const response = await axios.post(`${backend_url}/auth/register`, user);
      login(response.data.token);
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("User with the given email already exists.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/2">
            <img
              className="h-full w-full object-contain"
              src={logo}
              alt="Logo"
            />
          </div>
          <div className="p-8 md:w-1/2 md:ml-8">
            <h2 className="text-center text-2xl font-bold mb-5">Sign Up</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex items-center mb-4">
                <MDBIcon
                  fas
                  icon="user"
                  size="lg"
                  className="me-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center mb-4">
                <MDBIcon
                  fas
                  icon="user"
                  size="lg"
                  className="me-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center mb-4">
                <MDBIcon
                  fas
                  icon="envelope"
                  size="lg"
                  className="me-3 text-gray-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center mb-4">
                <MDBIcon
                  fas
                  icon="lock"
                  size="lg"
                  className="me-3 text-gray-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center mb-4">
                <MDBIcon
                  fas
                  icon="info-circle"
                  size="lg"
                  className="me-3 text-gray-400"
                />
                <textarea
                  placeholder="About"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center mb-4 pl-3">
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                >
                  Register
                </button>
              </div>
              {error && <p className="mt-2 text-red-600">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
