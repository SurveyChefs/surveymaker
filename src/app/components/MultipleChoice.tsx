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
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Question Text</label>
        <input
          type="text"
          value={questionName}
          onChange={(e) => setQuestionName(e.target.value)}
          placeholder="Enter your question"
          className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium">Answer Options</label>
        {answers.map((answer, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder={`Answer ${index + 1}`}
              className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={skipLogic[answer] !== undefined ? skipLogic[answer].toString() : ""}
              onChange={(e) => handleSkipLogicChange(answer, e.target.value)}
              className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Continue to next</option>
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
              className="p-2 text-red-400 hover:text-red-300"
              disabled={answers.length === 1}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addAnswerField}
        className="w-full p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
      >
        Add Answer Option
      </button>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleConfirm}
          disabled={!questionName.trim() || !answers.some(a => a.trim())}
          className="flex-1 p-2 bg-green-500 text-white rounded hover:bg-green-600 
            disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Add Question
        </button>
        <button
          onClick={onCancel}
          className="flex-1 p-2 bg-gray-600 text-white rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MultipleChoice;
