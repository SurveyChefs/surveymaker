"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              SurveyChampion
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {loading ? (
              <div className="text-gray-300 animate-pulse">Loading...</div>
            ) : user ? (
              <>
                <Link 
                  href="/surveybuilder" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Survey
                </Link>
                <div className="flex items-center space-x-6 border-l border-gray-700 pl-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-300">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="text-gray-300 hover:text-white transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } lg:hidden fixed inset-0 z-50 bg-gray-800 bg-opacity-95`}
      >
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
          {loading ? (
            <div className="text-gray-300 animate-pulse">Loading...</div>
          ) : user ? (
            <>
              <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white text-3xl font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-300 text-xl">
                  {user.name}
                </span>
              </div>
              <Link 
                href="/surveybuilder" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-xl transition-colors"
                onClick={toggleMenu}
              >
                Create Survey
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-xl transition-colors flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <Link
                href="/login"
                className="text-white text-xl hover:text-blue-400 transition-colors px-6 py-3"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-xl transition-colors"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
