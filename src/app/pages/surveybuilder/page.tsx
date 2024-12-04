"use client";

import React, { useState } from "react";
import { Question, QuestionType } from "../../types";
import MultipleChoice from "../../components/MultipleChoice";
import TextEntry from "../../components/TextEntry";

// Function to send survey data to the backend
const saveSurveyToDatabase = async (title: string, description: string, questions: Question[]) => {
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
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);

  const addQuestion = (question: Question) => {
    setQuestions((prev) => [...prev, question]);
    setSelectedType(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Survey Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded mb-2"
          style={{ color: "black" }}
        />
        <textarea
          placeholder="Survey Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded"
          style={{ color: "black" }}
        />
      </div>

      <div className="mb-6">
        <button
          onClick={() => setSelectedType("multipleChoice")}
          className="block p-2 border border-gray-500 rounded mb-2"
        >
          Add Multiple Choice
        </button>
        <button
          onClick={() => setSelectedType("textEntry")}
          className="block p-2 border border-gray-500 rounded mb-2"
        >
          Add Text Entry
        </button>
      </div>

      <div>
        {selectedType === "multipleChoice" && (
          <MultipleChoice onAddQuestion={addQuestion} />
        )}
        {selectedType === "textEntry" && (
          <TextEntry onAddQuestion={addQuestion} />
        )}
      </div>

      <h2 className="text-lg font-bold">Survey Preview</h2>
      <div className="mt-6 border border-gray-200 rounded py-3 px-3">
        {title && <h3 className="text-xl font-semibold">{title}</h3>}
        {description && <p className="text-white mb-4">{description}</p>}

        {questions.map((q, index) => (
          <div key={index} className="mb-4 p-2 border border-gray-200 rounded">
            <h3>{q.name}</h3>
            <ul>
              {q.answers?.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-4">
        <button
          onClick={() => saveSurveyToDatabase(title, description, questions)}
          className="p-2 bg-green-500 text-white rounded"
        >
          Save Survey
        </button>
      </div>
    </div>
  );
};

export default SurveyBuilder;
