"use client"

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div>
      <h1>Survey Analytics</h1>
      <div>
        {surveyStats.map((survey) => (
          <div key={survey.surveyId}>
            <h3>
              <Link href={`/pages/analytics/${survey.surveyId}`}>
                {survey.title} - {survey.responseCount} responses
              </Link>
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}