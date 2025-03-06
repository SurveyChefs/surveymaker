"use client";

import React, { useState } from "react";
import { Question, SkipLogic } from "../types";

interface SkipLogicManagerProps {
  questions: Question[];
  onSave: (questions: Question[]) => void;
  onCancel: () => void;
}

const SkipLogicManager: React.FC<SkipLogicManagerProps> = ({
  questions,
  onSave,
  onCancel,
}) => {
  const [updatedQuestions, setUpdatedQuestions] = useState<Question[]>(questions);

  const handleSkipLogicChange = (
    questionIndex: number,
    answer: string,
    skipToIndex: string
  ) => {
    const skipTo = parseInt(skipToIndex);
    const question = updatedQuestions[questionIndex];
    
    if (!question.skipLogic) {
      question.skipLogic = [];
    }

    const existingLogicIndex = question.skipLogic.findIndex(
      (logic) => logic.answer === answer
    );

    if (skipToIndex === "") {
      // Remove skip logic for this answer
      if (existingLogicIndex !== -1) {
        question.skipLogic.splice(existingLogicIndex, 1);
      }
    } else if (!isNaN(skipTo)) {
      // Update or add skip logic
      const newLogic: SkipLogic = { answer, skipToIndex: skipTo };
      if (existingLogicIndex !== -1) {
        question.skipLogic[existingLogicIndex] = newLogic;
      } else {
        question.skipLogic.push(newLogic);
      }
    }

    setUpdatedQuestions([...updatedQuestions]);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6">Configure Skip Logic</h2>
      
      <div className="space-y-6">
        {updatedQuestions.map((question, qIndex) => (
          question.type === "multipleChoice" && question.answers && (
            <div key={qIndex} className="bg-gray-750 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">
                Question {qIndex + 1}: {question.name}
              </h3>
              
              <div className="space-y-3">
                {question.answers.map((answer, aIndex) => (
                  <div key={aIndex} className="flex items-center gap-3">
                    <span className="text-gray-300 min-w-[100px]">{answer}</span>
                    <select
                      value={
                        question.skipLogic?.find((logic) => logic.answer === answer)
                          ?.skipToIndex.toString() || ""
                      }
                      onChange={(e) =>
                        handleSkipLogicChange(qIndex, answer, e.target.value)
                      }
                      className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                    >
                      <option value="">No Skip</option>
                      {updatedQuestions.map((_, index) => (
                        index !== qIndex && (
                          <option key={index} value={index}>
                            Skip to Q{index + 1}
                          </option>
                        )
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => onSave(updatedQuestions)}
          className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-lg font-semibold"
        >
          Save Skip Logic
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SkipLogicManager; 