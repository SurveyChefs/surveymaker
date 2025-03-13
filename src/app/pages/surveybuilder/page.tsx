"use client";

import React, { useState } from "react";
import { Question, QuestionType } from "../../types";
import MultipleChoice from "../../components/MultipleChoice";
import TextEntry from "../../components/TextEntry";
import Navbar from "@/app/components/Navbar";
import SkipLogicManager from "@/app/components/SkipLogicManager";
import toast from "react-hot-toast";

const saveSurveyToDatabase = async (
  title: string,
  description: string,
  questions: Question[]
) => {
  try {
    const response = await fetch("/api/survey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        description,
        questions,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success("Survey created successfully!", {
        duration: 2000,
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151',
          borderRadius: '0.5rem',
        },
      });
      // Wait for 1.5 seconds before redirecting
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      toast.error(`Error creating survey: ${data.message}`, {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151',
          borderRadius: '0.5rem',
        },
      });
    }
  } catch (error) {
    toast.error("Error creating survey. Please try again.", {
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #374151',
        borderRadius: '0.5rem',
      },
    });
  }
};

const SurveyBuilder = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSkipLogic, setShowSkipLogic] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  const addQuestion = (question: Question) => {
    if (editingQuestionIndex !== null) {
      // Update existing question
      setQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions[editingQuestionIndex] = question;
        return newQuestions;
      });
      setEditingQuestionIndex(null);
    } else {
      // Add new question
      setQuestions((prev) => [...prev, question]);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    toast((t) => (
      <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg border border-gray-700">
        <p className="text-white">Are you sure you want to delete this question?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              setQuestions(prev => prev.filter((_, i) => i !== index));
              toast.success("Question deleted successfully", { 
                id: t.id,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }
              });
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: "top-center",
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #374151',
        borderRadius: '0.5rem',
      }
    });
  };

  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setSelectedType(question.type as QuestionType);
    setEditingQuestionIndex(index);
  };

  const handleSkipLogicSave = (updatedQuestions: Question[]) => {
    setQuestions(updatedQuestions);
    setShowSkipLogic(false);
  };

  const handleCancel = () => {
    setShowQuestionTypes(false);
    setSelectedType(null);
  };

  // Function to handle closing the preview modal
  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-8">
        <div className="w-full max-w-2xl bg-gray-800 text-white p-8 rounded-lg shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-blue-400">Reactive Survey Builder</h1>
            <p className="text-xl text-gray-300">Create interactive surveys with skip logic and dynamic responses</p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-lg" htmlFor="title">Survey Title</label>
            <input
            id="title"
              type="text"
              placeholder="Enter survey title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />


          </div>

          <div className="mb-6">
            <label className="block mb-2 text-lg" htmlFor="description">Survey Description</label>
            <textarea
              placeholder="Enter survey description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              rows={4}
            />
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowQuestionTypes((prev) => !prev)}
              className={`w-full p-3 text-lg font-semibold text-white rounded-lg transition-colors duration-200 ${
                showQuestionTypes 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {showQuestionTypes ? "Hide Question Types" : "Add Question"}
            </button>

            {showQuestionTypes && (
              <div className="mt-4 border border-gray-600 rounded-lg p-4 bg-gray-750">
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setSelectedType("multipleChoice")}
                    className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-lg"
                  >
                    Multiple Choice
                  </button>
                  <button
                    onClick={() => setSelectedType("textEntry")}
                    className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-lg"
                  >
                    Text Entry
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Show all added questions */}
          <div className="mb-6 space-y-4">
            {questions.map((question, index) => (
              <div key={index} className="bg-gray-750 p-4 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    Question {index + 1}: {question.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditQuestion(index)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                {question.type === "multipleChoice" && question.answers && (
                  <div className="space-y-2">
                    {question.answers.map((answer, ansIndex) => (
                      <div key={ansIndex} className="flex items-center gap-2">
                        <span className="text-gray-400">Q{ansIndex + 1}.</span>
                        <span className="text-gray-300">{answer}</span>
                        {question.skipLogic?.find(logic => logic.answer === answer) && (
                          <span className="text-blue-400 text-sm">
                            (Skips to Q{(question.skipLogic?.find(logic => logic.answer === answer)?.skipToIndex ?? 0) + 1})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {question.type === "textEntry" && (
                  <div className="text-gray-300">Text Entry Question</div>
                )}
              </div>
            ))}
          </div>

          {/* Question form */}
          {selectedType === "multipleChoice" && (
            <div className="mb-6">
              <MultipleChoice 
                onAddQuestion={addQuestion} 
                onCancel={() => {
                  handleCancel();
                  setEditingQuestionIndex(null);
                }}
                questionIndex={questions.length}
                totalQuestions={questions.length}
                editingQuestion={editingQuestionIndex !== null ? questions[editingQuestionIndex] : undefined}
              />
            </div>
          )}
          {selectedType === "textEntry" && (
            <div className="mb-6">
              <TextEntry 
                onAddQuestion={(question) => addQuestion({ ...question, index: questions.length })} 
                onCancel={() => {
                  handleCancel();
                  setEditingQuestionIndex(null);
                }}
                editingQuestion={editingQuestionIndex !== null ? questions[editingQuestionIndex] : undefined}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setShowSkipLogic(true)}
              className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={questions.length === 0}
            >
              Configure Skip Logic
            </button>

            <button
              onClick={() => setShowPreview(true)}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={questions.length === 0}
            >
              Preview Survey
            </button>

            <button
              onClick={() => saveSurveyToDatabase(title, description, questions)}
              className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={questions.length === 0}
            >
              Save Survey
            </button>
          </div>
        </div>
      </div>

      {/* Skip Logic Modal */}
      {showSkipLogic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <SkipLogicManager
              questions={questions}
              onSave={handleSkipLogicSave}
              onCancel={() => setShowSkipLogic(false)}
            />
          </div>
        </div>
      )}

      {/* Survey Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg w-full max-w-2xl">
            <div className="rounded-lg border border-gray-600 bg-gray-800 p-6 shadow-md">
              <h1 className="mb-4 text-3xl font-bold text-white">{title}</h1>
              <p className="mb-8 text-lg text-gray-300">{description}</p>

              <div className="space-y-6">
                {questions.map((q, index) => (
                  <div key={index} className="rounded-lg border border-gray-600 bg-gray-700 p-4">
                    <h3 className="mb-4 text-xl font-semibold text-white">
                      Question {index + 1}: {q.name}
                    </h3>

                    {q.type === "multipleChoice" && q.answers && (
                      <div className="space-y-3">
                        {q.answers.map((answer, ansIndex) => (
                          <div key={ansIndex} className="flex items-center">
                            <input
                              type="radio"
                              id={`q${index}-a${ansIndex}`}
                              name={`question-${index}`}
                              className="h-4 w-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
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

                    {q.type === "textEntry" && (
                      <textarea
                        className="w-full p-3 bg-gray-800 border-2 border-blue-500 rounded-md text-white 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Type your answer here..."
                        rows={4}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleClosePreview}
                  className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 
                    transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyBuilder;
