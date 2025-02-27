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
        <div className="w-full max-w-2xl bg-gray-800 text-white p-8 rounded-lg shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-blue-400">Reactive Survey Builder</h1>
            <p className="text-xl text-gray-300">Create interactive surveys with skip logic and dynamic responses</p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-lg">Survey Title</label>
            <input
              type="text"
              placeholder="Enter survey title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-lg">Survey Description</label>
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

          {selectedType === "multipleChoice" && (
            <div className="mb-6">
              <MultipleChoice 
                onAddQuestion={addQuestion} 
                onCancel={handleCancel}
                questionIndex={questions.length}
                totalQuestions={questions.length}
              />
            </div>
          )}
          {selectedType === "textEntry" && (
            <div className="mb-6">
              <TextEntry 
                onAddQuestion={(question) => addQuestion({ ...question, index: questions.length })} 
                onCancel={handleCancel}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => saveSurveyToDatabase(title, description, questions)}
              className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={questions.length === 0}
            >
              Save Survey
            </button>

            <button
              onClick={() => setShowPreview(true)}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
