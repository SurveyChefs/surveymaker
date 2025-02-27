"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SurveyChart from "@/app/components/SurveyChart";
import SurveyBarChart from "@/app/components/SurveyBarChart";
import Navbar from "@/app/components/Navbar";

interface Survey {
  title: string;
  questions: {
    name: string;
    type: string;
    answers?: string[];
  }[];
}

interface SurveyAnswer {
  questionIndex: number;
  answer: string;
}

interface DetailedResponse {
  question: string;
  type: string;
  answerCounts?: { [key: string]: number };
  textResponses?: string[];
}

const SurveyDetail = () => {
  const [surveyData, setSurveyData] = useState<{
    survey: Survey;
    detailedResponses: DetailedResponse[];
  } | null>(null);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const { surveyId } = useParams() as { surveyId: string | undefined };

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      if (!surveyId) return;
      const res = await fetch(`/api/analytics/${surveyId}`);
      const data = await res.json();
      setSurveyData(data);
    };

    if (surveyId) {
      fetchSurveyDetails();
    }
  }, [surveyId]);

  if (!surveyData) return <div>Loading...</div>;

  return (
    <div className="bg-[#111827] min-h-screen text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-start min-h-screen p-4">
        <h1 className="text-3xl mb-6">{surveyData.survey.title}</h1>
        <div className="mb-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={chartType === "bar"}
              onChange={() =>
                setChartType(chartType === "pie" ? "bar" : "pie")
              }
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full dark:bg-gray-700 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-200">
              {chartType === "pie" ? "Pie Chart" : "Bar Chart"}
            </span>
          </label>
        </div>
        <div className="space-y-8 w-full">
          {surveyData.detailedResponses.map((response, idx) => (
            <div key={idx} className="flex justify-center w-full">
              <div className="w-full max-w-md min-h-[400px] flex flex-col items-center justify-start bg-gray-700 border border-gray-600 rounded-md p-4">
                <h2 className="text-xl mb-4 text-center">{response.question}</h2>
                {response.type === "multipleChoice" ? (
                  chartType === "pie" ? (
                    <SurveyChart data={response.answerCounts!} />
                  ) : (
                    <SurveyBarChart data={response.answerCounts!} />
                  )
                ) : (
                  <div className="space-y-2">
                    {response.textResponses?.map((text, idx) => (
                      <p key={idx} className="text-sm">
                        {text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyDetail;
