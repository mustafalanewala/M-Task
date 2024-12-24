// src/components/Auth/Login.js
import React from "react";
import { signInWithGoogle } from "../../firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Player } from "@lottiefiles/react-lottie-player";

const Login = () => {
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      dispatch(
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        })
      );
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-r from-blue-500 to-blue-700">
      {/* Left Section: Image */}
      <div className="w-full md:w-3/5 h-1/2 sm:h-full flex items-center justify-center py-8 md:py-0">
        <Player
          autoplay
          loop
          src="/assets/Hero.json"
          style={{ height: "80%", width: "100%" }}
        />
      </div>

      {/* Right Section: Login Form */}
      <div className="w-full md:w-2/5 h-1/2 sm:h-full bg-white flex items-center justify-center p-8 md:p-16 shadow-lg md:ml-4 mt-8 md:mt-0">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 text-center">
            Welcome To <span className="text-blue-600">MTasks</span>
          </h1>
          <p className="text-base sm:text-lg mb-6 text-gray-600 text-center">
            Sign in to access your task management dashboard and improve your
            productivity.
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={handleLogin}
            className="flex items-center justify-center space-x-4 px-8 py-3 bg-gray-900 text-white rounded-lg shadow-md hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 mb-6"
          >
            <img
              src="/assets/google.png"
              alt="Google Logo"
              className="w-6 h-6"
            />
            <span className="font-semibold">Sign in with Google</span>
          </button>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;
