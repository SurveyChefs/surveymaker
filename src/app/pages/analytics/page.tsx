"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

interface SurveyStats {
  title: string;
  responseCount: number;
  surveyId: string;
}

export default function AnalyticsPage() {
  const [surveyStats, setSurveyStats] = useState<SurveyStats[]>([]);

  useEffect(() => {
    const fetchSurveyStats = async () => {
      const res = await fetch("/api/analytics");
      const data = await res.json();
      setSurveyStats(data);
    };

    fetchSurveyStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">Survey Analytics</h1>
          <p className="text-xl text-gray-300">View insights and statistics from your surveys</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {surveyStats.map((survey) => (
            <Link
              key={survey.surveyId}
              href={`/pages/analytics/${survey.surveyId}`}
              className="transform transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="h-full rounded-lg border border-gray-600 bg-gray-800 p-6 shadow-lg hover:border-gray-500 hover:shadow-xl">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{survey.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>{survey.responseCount} responses</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-blue-400 hover:text-blue-300">
                    <span>View Details</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
