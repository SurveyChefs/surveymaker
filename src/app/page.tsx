"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div className="grid grid-rows-[60px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 bg-gray-900 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Navbar Section */}
      <nav className="w-full bg-gray-800 p-4 flex justify-between items-center text-white">
        <div className="text-xl font-semibold">
          <Link href="/">SurveyChampion</Link>
        </div>
        <div className="flex gap-6">
          {isAuthenticated ? (
            <>
              <span className="text-sm">Hello, User</span>
              <button
                onClick={logout}
                className="bg-gray-800 text-sm text-white rounded-full px-4 py-2 hover:bg-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="bg-gray-800 text-sm text-white rounded-full px-4 py-2 hover:bg-gray-600">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ol className="text-xl text-center font-[family-name:var(--font-geist-mono)]">
          <h1 className="mb-4 text-xl">SurveyChampion</h1>
          <h3>Go take or create surveys</h3>
        </ol>

        {/* Other Buttons */}
        <Link href="/pages/surveybuilder">
          <button className="mb-4 bg-gray-800 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-gray-900 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
            Go to Survey Builder
          </button>
        </Link>
        <Link href="/pages/surveys">
          <button className="mb-4 ml-1.5 bg-gray-800 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-gray-900 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
            Go to Survey Taker
          </button>
        </Link>
        <a
          className="rounded-full bg-gray-800 border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-gray-900 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-9 sm:min-w-44"
          target="_blank"
          rel="noopener noreferrer"
        >
          User Information
        </a>

        {/* Dashboard Section */}
        {isAuthenticated && (
          <div className="mt-10 w-full bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-center text-white mb-6">Dashboard</h2>
            <div className="grid grid-cols-2 gap-6 text-white">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold">Surveys Created</h3>
                <p className="text-2xl">12</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold">Surveys Completed</h3>
                <p className="text-2xl">34</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold">Active Participation</h3>
                <p className="text-2xl">5</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold">User Feedback</h3>
                <p className="text-2xl">98%</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div>
          <h1>Surveys</h1>
        </div>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Oby, Robertas, Igor, James
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          2025
        </a>
      </footer>
    </div>
  );
}
