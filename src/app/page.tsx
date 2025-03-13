"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-blue-400 mb-4">
            Survey Management System
          </h1>
          <p className="text-xl text-gray-300">
            Create, manage, and analyze surveys with ease
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            href="pages/surveybuilder"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 transition-transform hover:scale-105"
          >
            <div className="relative z-10">
              <div className="mb-4 text-blue-200">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Create Survey</h2>
              <p className="text-blue-100">Design and build custom surveys</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 to-blue-700/50 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>

          <Link
            href="pages/surveys"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-green-700 p-8 transition-transform hover:scale-105"
          >
            <div className="relative z-10">
              <div className="mb-4 text-green-200">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Take Survey</h2>
              <p className="text-green-100">Participate in available surveys</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/50 to-green-700/50 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>

          <Link
            href="pages/analytics"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 p-8 transition-transform hover:scale-105"
          >
            <div className="relative z-10">
              <div className="mb-4 text-purple-200">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Analytics</h2>
              <p className="text-purple-100">View survey results and insights</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-purple-700/50 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-400 text-lg">
            Get started by creating your first survey or exploring existing ones
          </p>
        </div>
      </div>
    </main>
  );
}
