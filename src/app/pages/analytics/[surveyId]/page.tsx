"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams instead of useRouter
import SurveyChart from "@/app/components/SurveyChart";

// Define types for survey and responses
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
  const [surveyData, setSurveyData] = useState<{ survey: Survey; detailedResponses: DetailedResponse[] } | null>(null);
  
  // Type the result from useParams to explicitly include 'surveyId'
  const { surveyId } = useParams() as { surveyId: string | undefined }; // Add type assertion

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      if (!surveyId) return; // Ensure surveyId is available before making the request
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
    <div>
      <h1>{surveyData.survey.title}</h1>
      {surveyData.detailedResponses.map((response, idx) => (
        <div key={idx}>
          <h2>{response.question}</h2>
          {response.type === "multipleChoice" ? (
            <SurveyChart data={response.answerCounts!} />
          ) : (
            <div>
              {response.textResponses?.map((text, idx) => (
                <p key={idx}>{text}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SurveyDetail;
