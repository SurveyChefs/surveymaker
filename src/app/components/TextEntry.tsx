"use client";

import React, { useState } from "react";
import { Question } from "../types";

type Props = {
  onAddQuestion: (question: Question) => void;
  onCancel: () => void; 
};

const TextEntry: React.FC<Props> = ({ onAddQuestion, onCancel }) => {
  const [questionName, setQuestionName] = useState("");

  const handleConfirm = () => {
    if (questionName.trim()) {
      onAddQuestion({ type: "textEntry", name: questionName });
      setQuestionName(""); 
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded mb-4 bg-gray-800 text-white">
      <input
        type="text"
        placeholder="Question Name"
        value={questionName}
        onChange={(e) => setQuestionName(e.target.value)}
        className="block w-full p-2 border border-gray-600 rounded mb-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleConfirm}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Confirm
        </button>
        <button
          onClick={onCancel} 
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TextEntry;
