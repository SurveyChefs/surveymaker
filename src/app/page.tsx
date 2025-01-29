"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  

  return (

    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
  
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ol className="text-xl text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <h1 className="mb-2 ml-14 text-xl">SurveyChampion</h1>
          <h3>Go take or create surveys</h3>
        </ol>

        <div className="ml-10">
        <Link href="/pages/surveybuilder">
        <button className="mb-4 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
          Go to Survey Builder
        </button>
        </Link>
        <Link href="/pages/surveys">
        <button className="mb-4 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
          Go to Survey Taker
        </button>
        </Link>
        <a
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-9 sm:min-w-44 "
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              User Information 
        </a>
        </div>
        

      
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div>
          <h1>Surveys</h1>
        </div>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Oby, Robertas, Igor, James
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          2024
        </a>
      </footer>
    </div>
  );
}
