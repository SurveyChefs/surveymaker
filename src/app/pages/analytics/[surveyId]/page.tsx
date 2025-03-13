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
        
        <div className="mb-8 flex items-center gap-4">
          <span className={`text-sm font-medium ${chartType === 'pie' ? 'text-blue-400' : 'text-gray-400'}`}>
            Pie Chart
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={chartType === "bar"}
              onChange={() => setChartType(chartType === "pie" ? "bar" : "pie")}
            />
            <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer 
              peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
              after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600">
            </div>
          </label>
          <span className={`text-sm font-medium ${chartType === 'bar' ? 'text-blue-400' : 'text-gray-400'}`}>
            Bar Chart
          </span>
        </div>

        <div className="space-y-8 w-full">
          {surveyData.detailedResponses
            .filter(response => {
              // For multiple choice questions, check if there are any answers
              if (response.type === "multipleChoice") {
                return response.answerCounts && 
                       Object.keys(response.answerCounts).length > 0 && 
                       Object.values(response.answerCounts).some(count => count > 0);
              }
              // For text entry questions, check if there are any text responses
              return response.textResponses && response.textResponses.length > 0;
            })
            .map((response, idx) => (
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

          {/* Show message if no responses */}
          {surveyData.detailedResponses.every(response => 
            (response.type === "multipleChoice" && 
             (!response.answerCounts || Object.keys(response.answerCounts).length === 0)) ||
            (response.type === "textEntry" && 
             (!response.textResponses || response.textResponses.length === 0))
          ) && (
            <div className="text-center py-8">
              <p className="text-gray-400">No responses have been recorded for this survey yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyDetail;
