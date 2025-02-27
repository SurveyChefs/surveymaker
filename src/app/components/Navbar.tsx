"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* Wrap SurveyChampion text in Link to make it clickable */}
        <Link href="/" className="text-white text-xl font-semibold">
          SurveyChampion
        </Link>

        <button
          onClick={toggleMenu}
          className="lg:hidden text-white focus:outline-none"
        >
          <div className="space-y-2">
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </div>
        </button>

        {/* Desktop Menu (Visible on large screens) */}
        <div className="hidden lg:flex space-x-6 text-white">
          <Link href="/pages" className="hover:underline ml-7">
            Login
          </Link>
        </div>
      </div>

      {/* Mobile Menu (Hidden on large screens) */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute top-0 left-0 w-full bg-gray-800 bg-opacity-90 lg:hidden`}
      >
        <div className="flex flex-col items-center space-y-4 py-6 text-white">
          <Link
            href="/pages/surveys"
            className="hover:underline"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
