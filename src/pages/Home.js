import React from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";

const Home = () => {
  return (
    <div className="bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-400 text-white px-6 py-4 fixed w-full top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">MTasks</h1>
          <ul className="flex space-x-8 text-md font-semibold">
            <li>
              <Link
                to="#home"
                className="hover:text-blue-100 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="#features"
                className="hover:text-blue-100 transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="#how-it-works"
                className="hover:text-blue-100 transition-colors"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                to="#contact"
                className="hover:text-blue-100 transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-between container mx-auto px-6 text-gray-800">
        {/* Left Section */}
        <div className="w-full md:w-1/2 text-left">
          <h4 className="text-blue-600 font-medium text-sm uppercase">
            Your Tasks, Simplified.
          </h4>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Take charge of your tasks and streamline your day with MTasks.
          </h2>
          <p className="text-xl font-light opacity-80 mb-6">
            MTask is your all-in-one task management solution designed for
            seamless productivity. From managing tasks effortlessly to gaining
            actionable insights with analytics, MTask empowers you to do more.
          </p>
          <button className="px-8 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-colors">
            Get Started
          </button>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 mt-14 flex justify-center">
          <Player
            autoplay
            loop
            src="/assets/Hero.json"
            style={{ height: "42rem", width: "100%" }}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
