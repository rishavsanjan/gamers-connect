import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { LuGamepad2 } from "react-icons/lu";

const HeroHomepage = () => {
  return (
    <div className="relative h-[80vh] w-full flex flex-col justify-center items-center gap-6">
      {/* Background Image */}
      <img
        src="https://cdn.pixabay.com/photo/2024/05/24/16/40/ai-generated-8785420_1280.jpg"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay / Tint */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Gaming Tag */}
      <div className="relative z-10 border-purple-400 border flex flex-row rounded-full p-2 px-4 gap-2 items-center">
        <LuGamepad2 className="text-2xl text-purple-500" />
        <p className="text-white font-medium">Your ultimate gaming companion</p>
      </div>

      {/* Hero Heading */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl sm:text-7xl font-bold text-white">
          Discover, Track & Share Your{" "}
          <span className="bg-gradient-to-r from-[#6F25D2] to-[#831FB0] bg-clip-text text-transparent">
            Gaming Journey
          </span>
        </h1>
      </div>

      {/* Description */}
      <p className="relative z-10 text-gray-400 max-w-2xl text-center text-lg">
        Join thousands of gamers exploring new worlds, tracking progress, and
        connecting with the community. Your next adventure awaits.
      </p>

      {/* Buttons */}
      <div className="relative z-10 flex flex-row gap-4">
        <button className="bg-gradient-to-r from-purple-800 to-pink-600 flex items-center p-2 rounded-xl gap-2 px-4 hover:scale-105 transition">
          <p className="text-sm text-white font-semibold">Start Exploring</p>
          <BsArrowRight className="text-lg text-white" />
        </button>
        <button className="border border-purple-400 p-2 rounded-xl px-4 hover:bg-purple-900 transition">
          <p className="text-sm text-white font-bold">View Trending Games</p>
        </button>
      </div>
    </div>
  );
};

export default HeroHomepage;
