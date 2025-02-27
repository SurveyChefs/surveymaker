"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-8">
        <main className="w-full max-w-2xl text-center">
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-blue-400 mb-4">SurveyChampion</h1>
            <p className="text-2xl text-gray-300">Create, Take, and Analyze Surveys with Ease</p>
          </div>

          <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
            <Link href="/pages/surveybuilder" className="w-full">
              <button className="w-full p-4 bg-blue-500 text-white text-xl font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200">
                Create Survey
              </button>
            </Link>
            
            <Link href="/pages/surveys" className="w-full">
              <button className="w-full p-4 bg-green-500 text-white text-xl font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200">
                Take Survey
              </button>
            </Link>
            
            <Link href="/pages/analytics" className="w-full">
              <button className="w-full p-4 bg-purple-500 text-white text-xl font-semibold rounded-lg hover:bg-purple-600 transition-colors duration-200">
                View Analytics
              </button>
            </Link>
          </div>
        </main>

        <footer className="mt-16 text-center text-gray-400">
          <div className="mb-2">
            <h2 className="text-xl font-semibold mb-1">Created by</h2>
            <p>Oby, Robertas, Igor, James</p>
          </div>
          <p>© 2025 SurveyChampion</p>
        </footer>
      </div>
    </div>
  );
}
