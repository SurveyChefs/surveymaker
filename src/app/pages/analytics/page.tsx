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
    <div className="bg-[#111827] min-h-screen text-white">
      <Navbar />
      <div className="p-4">
        <h1 className="text-3xl font-semibold text-white mb-6">Survey Analytics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mr-4 gap-6">
          {surveyStats.map((survey) => (
            <div
              key={survey.surveyId}
              className="w-full p-4 ml-2 rounded bg-gray-700 text-white border border-gray-600 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold">{survey.title}</h3>
              <p className="text-gray-400 mt-2">{survey.responseCount} responses</p>
              <Link
                href={`/pages/analytics/${survey.surveyId}`}
                className="block mt-4 text-blue-500 hover:text-blue-300"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
