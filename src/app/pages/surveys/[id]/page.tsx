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
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(new Set());
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
      return newAnswers;
    });

    // Update skipped questions based on skip logic
    const currentQuestion = survey.questions[questionIndex];
    if (currentQuestion?.skipLogic) {
      const skipLogic = currentQuestion.skipLogic.find(logic => logic.answer === answer);
      console.log('Found skip logic:', skipLogic, 'for answer:', answer);
      
      if (skipLogic) {
        // Create a new set of skipped questions
        const newSkipped = new Set<number>();
        // Add all questions between current and skip-to index to skipped set
        for (let i = questionIndex + 1; i < skipLogic.skipToIndex; i++) {
          newSkipped.add(i);
        }
        console.log('Setting skipped questions:', Array.from(newSkipped));
        setSkippedQuestions(newSkipped);

        // Also clear answers for skipped questions
        setAnswers(prev => {
          const newAnswers = [...prev];
          for (let i = questionIndex + 1; i < skipLogic.skipToIndex; i++) {
            newAnswers[i] = '';
          }
          return newAnswers;
        });
      } else {
        // If no skip logic for this answer, clear skipped questions after this question
        setSkippedQuestions(new Set());
        console.log('Clearing skip logic for answer:', answer);
      }
    } else {
      // If question has no skip logic, clear any existing skips
      setSkippedQuestions(new Set());
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Filter out skipped questions from answers
      const validAnswers = answers.map((answer, index) => ({
        questionIndex: index,
        answer: skippedQuestions.has(index) ? "" : answer
      })).filter(a => !skippedQuestions.has(a.questionIndex));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyId: id,
          answers: validAnswers,
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

  // Check if all required questions are answered (excluding skipped ones)
  const isComplete = survey.questions.every((_, index) => 
    skippedQuestions.has(index) || answers[index]
  );

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
                const isSkipped = skippedQuestions.has(index);
                return (
                  <div 
                    key={index}
                    className={`rounded-lg border-2 border-gray-600 p-6 shadow-lg transition-all duration-200
                      ${isSkipped ? 'opacity-50 bg-gray-800 pointer-events-none' : 'bg-gray-700'}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold
                        ${isSkipped ? 'bg-gray-500' : 'bg-blue-500'}`}>
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {question.name}
                      </h3>
                      {isSkipped && (
                        <span className="ml-auto text-gray-400 text-sm">Skipped</span>
                      )}
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
                              }`}
                            onClick={() => !isSkipped && handleAnswerChange(index, answer)}
                          >
                            <input
                              type="radio"
                              id={`q${index}-a${ansIndex}`}
                              name={`question-${index}`}
                              className="h-5 w-5 text-blue-500 focus:ring-2 focus:ring-blue-500"
                              checked={answers[index] === answer}
                              onChange={() => !isSkipped && handleAnswerChange(index, answer)}
                              disabled={isSkipped}
                            />
                            <label 
                              htmlFor={`q${index}-a${ansIndex}`}
                              className="ml-3 text-lg text-white cursor-pointer flex-grow"
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
                        onChange={(e) => !isSkipped && handleAnswerChange(index, e.target.value)}
                        placeholder="Enter your answer..."
                        className="w-full p-3 rounded-lg bg-gray-600 text-white border-2 border-gray-500 focus:border-blue-500 focus:outline-none"
                        rows={3}
                        disabled={isSkipped}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isComplete}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                  disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-lg font-semibold"
              >
                {isSubmitting ? "Submitting..." : "Submit Survey"}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}