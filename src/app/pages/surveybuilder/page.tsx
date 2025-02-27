"use client";

import React, { useState } from "react";
import { Question, QuestionType } from "../../types";
import MultipleChoice from "../../components/MultipleChoice";
import TextEntry from "../../components/TextEntry";
import Navbar from "@/app/components/Navbar";

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
      body: JSON.stringify({
        title,
        description,
        questions,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Survey saved successfully!");
    } else {
      alert(`Error saving survey: ${data.message}`);
    }
  } catch (error) {
    alert("Error saving survey. Please try again.");
  }
};

const SurveyBuilder = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [showPreview, setShowPreview] = useState(false);  

  const addQuestion = (question: Question) => {
    setQuestions((prev) => [...prev, question]);
    setSelectedType(null);
    setShowQuestionTypes(false);
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
        <div className="w-full max-w-lg bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <h1 className="mb-4">Reactive Survey Builder</h1>

          <div className="mb-4">
            <label className="block mb-1">Survey Title</label>
            <input
              type="text"
              placeholder="Enter survey title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Survey Description</label>
            <textarea
              placeholder="Enter survey description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <button
              onClick={() => setShowQuestionTypes((prev) => !prev)}
              className={`types-btn w-full p-2 text-white rounded ${showQuestionTypes ? "types-btn-active" : ""}`}
            >
              Add Question Types
            </button>

            {showQuestionTypes && (
              <div className="border border-gray-600 rounded p-4 mt-2">
                <button
                  onClick={() => setSelectedType("multipleChoice")}
                  className="block w-full p-2 bg-gray-700 text-white rounded mb-2 hover:bg-gray-600"
                >
                  Multiple Choice
                </button>
                <button
                  onClick={() => setSelectedType("textEntry")}
                  className="block w-full p-2 bg-gray-700 text-white rounded mb-2 hover:bg-gray-600"
                >
                  Text Entry
                </button>
              </div>
            )}
          </div>

          {selectedType === "multipleChoice" && (
            <MultipleChoice 
              onAddQuestion={addQuestion} 
              onCancel={handleCancel}
              questionIndex={questions.length}
              totalQuestions={questions.length}
            />
          )}
          {selectedType === "textEntry" && (
            <TextEntry 
              onAddQuestion={(question) => addQuestion({ ...question, index: questions.length })} 
              onCancel={handleCancel}
            />
          )}

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => saveSurveyToDatabase(title, description, questions)}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={questions.length === 0}
            >
              Submit
            </button>

            <button
              onClick={() => setShowPreview(true)}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={questions.length === 0}
            >
              Preview Survey
            </button>
          </div>
        </div>
      </div>

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
