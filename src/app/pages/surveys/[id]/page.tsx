"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import HomeButton from "@/app/components/HomeButton";
import Navbar from "@/app/components/Navbar";
import toast from "react-hot-toast";

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
    if (!survey) return;
    
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answer;

      // Don't auto-advance if we're on the last question
      if (questionIndex === survey.questions.length - 1) {
        return newAnswers;
      }

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

      toast.success("Survey submitted successfully!", {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151',
          borderRadius: '0.5rem',
        },
      });
      router.push("/");
    } catch (err) {
      setError("Failed to submit answers. Please try again.");
      toast.error("Failed to submit survey. Please try again.", {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151',
          borderRadius: '0.5rem',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simplify isLastVisibleQuestion to just check if we're on the last question
  const isLastVisibleQuestion = () => {
    if (!survey) return false;
    return currentQuestionIndex === survey.questions.length - 1;
  };

  // Update handleNextQuestion to check if we're on the last question
  const handleNextQuestion = () => {
    const currentQuestion = survey?.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    // If we're on the last question, don't do anything
    if (currentQuestionIndex === survey.questions.length - 1) {
      return;
    }

    // If there's an answer for the current question, check skip logic
    if (answers[currentQuestionIndex]) {
      if (currentQuestion.skipLogic) {
        const skipLogic = currentQuestion.skipLogic.find(
          logic => logic.answer === answers[currentQuestionIndex]
        );
        if (skipLogic) {
          setCurrentQuestionIndex(skipLogic.skipToIndex);
          return;
        }
      }
    }

    // If no skip logic or no matching skip logic, move to next question
    setCurrentQuestionIndex(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading survey...</div>
      </div>
    );
  }

  if (!survey) {
    notFound();
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-gray-600 bg-gray-800 p-8 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-blue-400 mb-4">{survey.title}</h1>
              <p className="text-xl text-gray-300">{survey.description}</p>
            </div>

            <HomeButton />

            <div className="space-y-6">
              {survey.questions.map((question, index) => {
                const isActive = index === currentQuestionIndex;
                const isAnswered = answers[index] !== undefined;
                const opacity = isActive ? 'opacity-100' : 'opacity-50';
                const borderColor = isActive ? 'border-blue-500' : 'border-gray-600';
                const bgColor = isActive ? 'bg-gray-700' : 'bg-gray-800';

                return (
                  <div 
                    key={index}
                    className={`rounded-lg border-2 ${borderColor} ${bgColor} p-6 shadow-lg transition-all duration-200 ${opacity}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        isActive ? 'bg-blue-500' : 'bg-gray-600'
                      } text-white font-semibold`}>
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {question.name}
                      </h3>
                    </div>

                    {question.type === "multipleChoice" && (
                      <div className="space-y-3">
                        {question.answers?.map((answer, ansIndex) => (
                          <div 
                            key={ansIndex} 
                            className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                              ${answers[index] === answer 
                                ? 'border-blue-500 bg-blue-500/10' 
                                : 'border-gray-600 hover:border-blue-500/50 hover:bg-gray-600'
                              }
                              ${!isActive ? 'cursor-not-allowed' : ''}`}
                            onClick={() => isActive && handleAnswerChange(index, answer)}
                          >
                            <input
                              type="radio"
                              id={`q${index}-a${ansIndex}`}
                              name={`question-${index}`}
                              className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-500"
                              onChange={() => isActive && handleAnswerChange(index, answer)}
                              checked={answers[index] === answer}
                              disabled={!isActive}
                            />
                            <label
                              htmlFor={`q${index}-a${ansIndex}`}
                              className={`ml-4 text-lg text-gray-200 flex-1 ${!isActive ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {answer}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === "textEntry" && (
                      <textarea
                        value={answers[index] || ""}
                        onChange={(e) => isActive && handleAnswerChange(index, e.target.value)}
                        className={`w-full p-3 bg-gray-800 border-2 border-blue-500 rounded-lg text-white text-lg
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
                          placeholder-gray-500 ${!isActive ? 'cursor-not-allowed opacity-50' : ''}`}
                        placeholder="Type your answer here..."
                        rows={3}
                        disabled={!isActive}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex gap-4">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex-1 p-4 bg-gray-600 text-white text-lg font-semibold rounded-lg 
                    hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}
              
              {!isLastVisibleQuestion() ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex-1 p-4 bg-blue-500 text-white text-lg font-semibold rounded-lg 
                    hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 p-4 bg-green-500 text-white text-lg font-semibold rounded-lg 
                    hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed 
                    transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Survey
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}