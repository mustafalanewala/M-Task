import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-400 text-white px-6 py-4 fixed w-full top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">MTasks</h1>
          {/* Mobile Toggle Button */}
          <button
            className="block md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
          {/* Links */}
          <ul
            className={`md:flex md:space-x-8 sm:space-y-0 space-y-4 text-2xl sm:text-lg font-semibold absolute md:static bg-blue-400 md:bg-transparent w-full md:w-auto left-0 top-16 md:top-0 px-6 py-4 md:p-0 transition-all duration-300 ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <li className="text-center md:text-left">
              <Link
                to="#home"
                className="hover:text-blue-100 transition-colors block md:inline"
              >
                Home
              </Link>
            </li>
            <li className="text-center md:text-left">
              <Link
                to="#features"
                className="hover:text-blue-100 transition-colors block md:inline"
              >
                Features
              </Link>
            </li>
            <li className="text-center md:text-left">
              <Link
                to="#how-it-works"
                className="hover:text-blue-100 transition-colors block md:inline"
              >
                How It Works
              </Link>
            </li>
            <li className="text-center md:text-left">
              <Link
                to="#contact"
                className="hover:text-blue-100 transition-colors block md:inline"
              >
                Contact
              </Link>
            </li>
            <li className="text-center md:text-left">
              <Link
                to="/login"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors block md:inline"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-wrap lg:flex-nowrap items-center justify-between px-6 text-gray-800 ">
        {/* Content Section */}
        <div className="w-full lg:w-1/2 text-left order-2 lg:order-1">
          <h4 className="text-blue-600 font-medium text-sm uppercase mb-1">
            Your Tasks, Simplified.
          </h4>
          <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Take charge of your tasks and streamline your day with MTasks.
          </h2>
          <p className="text-lg lg:text-xl font-light opacity-80 mb-6">
            MTask is your all-in-one task management solution designed for
            seamless productivity. From managing tasks effortlessly to gaining
            actionable insights with analytics, MTask empowers you to do more.
          </p>
          <Link to="/login">
            <button className="px-8 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-colors hover:bg-blue-500">
              Get Started
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 sm:h-full h-56 flex justify-center order-1 lg:order-2 lg:mb-0">
          <Player
            autoplay
            loop
            src="/assets/Hero.json"
            style={{ height: "22rem", width: "100%" }}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
