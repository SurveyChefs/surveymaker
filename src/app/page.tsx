"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  

  return (

    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 bg-gray-900 sm:p-20 font-[family-name:var(--font-geist-sans)]">
  
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ol className="text-xl text-center font-[family-name:var(--font-geist-mono)]">
          <h1 className="mb-4 text-xl">SurveyChampion</h1>
          <h3>Go take or create surveys</h3>
        </ol>

        <div className="ml-10">
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
        <Link href="/pages/analytics">
        <button className="mb-4 ml-1.5 bg-gray-800 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-gray-900 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
          Analytics
        </button>
        </Link>
        </div>
        

      
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
