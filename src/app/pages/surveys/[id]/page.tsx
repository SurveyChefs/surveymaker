"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import HomeButton from "@/app/components/HomeButton";
import Navbar from "@/app/components/Navbar";

interface Question {
  type: string;
  name: string;
  answers?: string[];
  skipLogic?: { answer: string; skipToIndex: number }[];
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
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch survey data
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

  // Handle answer changes
  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answer;

      // Check for skip logic
      const currentQuestion = survey?.questions[questionIndex];
      if (currentQuestion?.skipLogic) {
        const skipLogic = currentQuestion.skipLogic.find(logic => logic.answer === answer);
        if (skipLogic) {
          // Skip to the specified question
          setCurrentQuestionIndex(skipLogic.skipToIndex);
        } else {
          // Move to next question if no skip logic matches
          setCurrentQuestionIndex(questionIndex + 1);
        }
      } else {
        // Move to next question if no skip logic
        setCurrentQuestionIndex(questionIndex + 1);
      }

      return newAnswers;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyId: id,
          answers: answers.map((answer, index) => ({
            questionIndex: index,
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

  const currentQuestion = survey.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg border border-gray-600 bg-gray-800 p-6 shadow-md">
            <h1 className="mb-4 text-3xl font-bold text-white">{survey.title}</h1>
            <p className="mb-8 text-lg text-gray-300">{survey.description}</p>

            <HomeButton />

            <div className="space-y-6">
              {currentQuestion && (
                <div className="rounded-lg border border-gray-600 bg-gray-700 p-4">
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Question {currentQuestionIndex + 1}: {currentQuestion.name}
                  </h3>

                  {currentQuestion.type === "multipleChoice" && (
                    <div className="space-y-3">
                      {currentQuestion.answers?.map((answer, ansIndex) => (
                        <div key={ansIndex} className="flex items-center">
                          <input
                            type="radio"
                            id={`q${currentQuestionIndex}-a${ansIndex}`}
                            name={`question-${currentQuestionIndex}`}
                            className="h-4 w-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
                            onChange={() => handleAnswerChange(currentQuestionIndex, answer)}
                            checked={answers[currentQuestionIndex] === answer}
                          />
                          <label
                            htmlFor={`q${currentQuestionIndex}-a${ansIndex}`}
                            className="ml-3 text-gray-200"
                          >
                            {answer}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!currentQuestion.type || currentQuestion.type === "textEntry") && (
                    <textarea
                      value={answers[currentQuestionIndex] || ""}
                      onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                      className="w-full p-3 bg-gray-800 border-2 border-blue-500 rounded-md text-white 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Type your answer here..."
                      rows={4}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex-1 p-3 bg-gray-600 text-white rounded hover:bg-gray-700 
                    transition-colors"
                >
                  Previous
                </button>
              )}
              
              {!isLastQuestion ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="flex-1 p-3 bg-blue-500 text-white rounded hover:bg-blue-600 
                    transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 p-3 bg-green-500 text-white rounded hover:bg-green-600 
                    disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit Survey"}
                </button>
              )}
            </div>

            {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}