"use client";

import React, { useState } from "react";
import { Question, QuestionType } from "../../types";
import MultipleChoice from "../../components/MultipleChoice";
import TextEntry from "../../components/TextEntry";

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

  const addQuestion = (question: Question) => {
    setQuestions((prev) => [...prev, question]);
    setSelectedType(null);
    setShowQuestionTypes(false); // Hide the question type selection after adding a question
  };

  return (
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
              <button className="block w-full p-2 bg-gray-700 text-white rounded mb-2 hover:bg-gray-600">
                Slider
              </button>
              <button className="block w-full p-2 bg-gray-700 text-white rounded mb-2 hover:bg-gray-600">
                Matrix
              </button>
            </div>
          )}
        </div>

        {selectedType === "multipleChoice" && (
          <MultipleChoice onAddQuestion={addQuestion} />
        )}
        {selectedType === "textEntry" && (
          <TextEntry onAddQuestion={addQuestion} />
        )}

        <h2 className="text-lg font-semibold mt-6">Survey Preview</h2>
        <div className="mt-4 border border-gray-600 rounded p-4">
          {title && <h3 className="text-lg font-bold">{title}</h3>}
          {description && <p className="text-gray-300">{description}</p>}

          {questions.map((q, index) => (
            <div
              key={index}
              className="mt-4 p-2 border border-gray-600 rounded"
            >
              <h3>{q.name}</h3>
              <ul>
                {q.answers?.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={() => setShowQuestionTypes(true)}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add More Fields
          </button>
          <button
            onClick={() => saveSurveyToDatabase(title, description, questions)}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyBuilder;
