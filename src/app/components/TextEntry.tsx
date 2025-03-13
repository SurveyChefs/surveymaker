"use client";

import React, { useState } from "react";
import { Question } from "../types";

type Props = {
  onAddQuestion: (question: Question) => void;
  onCancel: () => void;
  editingQuestion?: Question;
};

const TextEntry: React.FC<Props> = ({ onAddQuestion, onCancel, editingQuestion }) => {
  const [questionName, setQuestionName] = useState(editingQuestion?.name || "");

  const handleConfirm = () => {
    if (questionName.trim()) {
      onAddQuestion({ 
        type: "textEntry", 
        name: questionName,
        description: "",
        index: editingQuestion?.index ?? 0
      });
      
      if (!editingQuestion) {
        clearForm();
      }
    }
  };

  const clearForm = () => {
    setQuestionName("");
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold text-blue-400">
          {editingQuestion ? "Edit Question" : "Question Title"}
        </label>
        <input
          type="text"
          value={questionName}
          onChange={(e) => setQuestionName(e.target.value)}
          placeholder="Enter your question"
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleConfirm}
          disabled={!questionName.trim()}
          className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-lg font-semibold"
        >
          {editingQuestion ? "Update Question" : "Add Question"}
        </button>
        <button
          onClick={clearForm}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
            transition-colors duration-200 text-lg font-semibold"
        >
          Clear Form
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 
            transition-colors duration-200 text-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TextEntry;
