"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";

interface Question {
  type: string;
  name: string;
  answers?: string[];
}

interface Survey {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
}

export default function SurveyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = use(params);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
          notFound();
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/survey?id=${id}`
        );
        
        if (!res.ok) {
          notFound();
        }

        const data = await res.json();
        setSurvey(data);
      } catch (error) {
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/answer", { /////// HERE
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyId: id,
          answers: Object.entries(answers).map(([index, answer]) => ({
            questionIndex: Number(index),
            answer,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answers");
      }

      router.push("/");
    } catch (err) {
      setError("Failed to submit answers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!survey) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-gray-600 bg-gray-800 p-6 shadow-md">
          <h1 className="mb-4 text-3xl font-bold text-white">{survey.title}</h1>
          <p className="mb-8 text-lg text-gray-300">{survey.description}</p>

          <div className="space-y-6">
            {survey.questions.map((question, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-600 bg-gray-700 p-4"
              >
                <h3 className="mb-4 text-xl font-semibold text-white">
                  {question.name}
                </h3>

                {question.type === "multipleChoice" && (
                  <div className="space-y-3">
                    {question.answers?.map((answer, ansIndex) => (
                      <div key={ansIndex} className="flex items-center">
                        <input
                          type="radio"
                          id={`q${index}-a${ansIndex}`}
                          name={`question-${index}`}
                          className="h-4 w-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
                          onChange={() => handleAnswerChange(index, answer)}
                          checked={answers[index] === answer}
                        />
                        <label
                          htmlFor={`q${index}-a${ansIndex}`}
                          className="ml-3 text-gray-200"
                        >
                          {answer}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 
                disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </button>

            {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}