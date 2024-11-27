import React, { useState } from "react";
import { Question } from "../types";

type Props = {
  onAddQuestion: (question: Question) => void;
};

const TextEntry: React.FC<Props> = ({ onAddQuestion }) => {
  const [questionName, setQuestionName] = useState("");

  const handleConfirm = () => {
    if (questionName.trim()) {
      onAddQuestion({ type: "textEntry", name: questionName });
      setQuestionName(""); 
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded mb-4">
      <input
        type="text"
        placeholder="Question Name"
        value={questionName}
        onChange={(e) => setQuestionName(e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button
        onClick={handleConfirm}
        className="mt-4 p-2 bg-green-500 text-white rounded"
      >
        Confirm
      </button>
    </div>
  );
};

export default TextEntry;