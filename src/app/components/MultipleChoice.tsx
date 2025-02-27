"use client";
import React, { useState } from "react";
import { Question, SkipLogic } from "../types";

type Props = {
  onAddQuestion: (question: Question) => void;
  onCancel: () => void;
  questionIndex: number;
  totalQuestions: number;
};

interface QuestionState {
  questionName: string;
  answers: string[];
  skipLogic: { [key: string]: number };
}

const MultipleChoice: React.FC<Props> = ({ onAddQuestion, onCancel, questionIndex, totalQuestions }) => {
  const [questionName, setQuestionName] = useState("");
  const [answers, setAnswers] = useState<string[]>([""]);
  const [skipLogic, setSkipLogic] = useState<{ [key: string]: number }>({});

  const addAnswerField = () => {
    setAnswers(prev => [...prev, ""]);
  };

  const removeAnswerField = (indexToRemove: number) => {
    setAnswers(prev => prev.filter((_, i) => i !== indexToRemove));
    // Remove skip logic for removed answer
    const newSkipLogic = { ...skipLogic };
    delete newSkipLogic[answers[indexToRemove]];
    setSkipLogic(newSkipLogic);
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      const oldAnswer = newAnswers[index];
      newAnswers[index] = value;

      // Update skip logic with new answer text
      if (oldAnswer in skipLogic) {
        const skipTo = skipLogic[oldAnswer];
        const newSkipLogic = { ...skipLogic };
        delete newSkipLogic[oldAnswer];
        newSkipLogic[value] = skipTo;
        setSkipLogic(newSkipLogic);
      }

      return newAnswers;
    });
  };

  const handleSkipLogicChange = (answer: string, skipToIndex: string) => {
    const skipTo = parseInt(skipToIndex);
    
    setSkipLogic(prev => {
      const newSkipLogic = { ...prev };
      if (skipToIndex === "") {
        delete newSkipLogic[answer];
      } else if (!isNaN(skipTo)) {
        newSkipLogic[answer] = skipTo;
      }
      return newSkipLogic;
    });
  };

  const handleConfirm = () => {
    if (questionName.trim() && answers.some(a => a.trim())) {
      const validAnswers = answers.filter(a => a.trim());
      const skipLogicArray: SkipLogic[] = Object.entries(skipLogic)
        .filter(([answer]) => validAnswers.includes(answer))
        .map(([answer, skipToIndex]) => ({
          answer,
          skipToIndex
        }));

      onAddQuestion({
        type: "multipleChoice",
        name: questionName,
        answers: validAnswers,
        skipLogic: skipLogicArray.length > 0 ? skipLogicArray : undefined,
        index: questionIndex,
        description: ""
      });

      // Reset form
      setQuestionName("");
      setAnswers([""]);
      setSkipLogic({});
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="mb-6">
        <label className="block mb-3 text-lg font-semibold text-blue-400">Question Text</label>
        <input
          type="text"
          value={questionName}
          onChange={(e) => setQuestionName(e.target.value)}
          placeholder="Enter your question"
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-lg font-semibold text-green-400">Answer Options</label>
          <button
            onClick={addAnswerField}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
          >
            <span>+</span> Add Option
          </button>
        </div>
        
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center gap-3 bg-gray-750 p-3 rounded-lg">
              <span className="text-gray-400 font-mono">{index + 1}.</span>
              <input
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder="Enter answer option"
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={skipLogic[answer] !== undefined ? skipLogic[answer].toString() : ""}
                onChange={(e) => handleSkipLogicChange(answer, e.target.value)}
                className="p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
              >
                <option value="">No Skip</option>
                {Array.from({ length: totalQuestions + 1 }, (_, i) => i).map((num) => (
                  num !== questionIndex && (
                    <option key={num} value={num}>
                      Skip to Q{num + 1}
                    </option>
                  )
                ))}
              </select>

              <button
                onClick={() => removeAnswerField(index)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                disabled={answers.length === 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleConfirm}
          disabled={!questionName.trim() || !answers.some(a => a.trim())}
          className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-lg font-semibold"
        >
          Add Question
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

export default MultipleChoice;
