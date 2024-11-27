"use client";
import React, { useState } from "react";
import { Question } from "../types";

type Props = {
  onAddQuestion: (question: Question) => void;
};

const MultipleChoice: React.FC<Props> = ({ onAddQuestion }) => {
  const [questions, setQuestions] = useState<
    { questionName: string; answers: string[]; currentAnswer: string }[]
  >([]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { questionName: "", answers: [""], currentAnswer: "" }
    ]);
  };

  const addAnswerField = (index: number) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      const currentQuestion = { ...updatedQuestions[index] };

      currentQuestion.answers = [...currentQuestion.answers, ""];

      updatedQuestions[index] = currentQuestion;

      return updatedQuestions;
    });
  };

  const removeAnswerField = (index: number, answerIndex: number) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      const currentQuestion = { ...updatedQuestions[index] };

      currentQuestion.answers = currentQuestion.answers.filter((_, i) => i !== answerIndex);

      updatedQuestions[index] = currentQuestion;

      return updatedQuestions;
    });
  };

  const handleQuestionNameChange = (index: number, value: string) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[index].questionName = value;
      return updatedQuestions;
    });
  };

  const handleAnswerChange = (index: number, answerIndex: number, value: string) => {
    setQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[index].answers[answerIndex] = value;
      return updatedQuestions;
    });
  };

  const handleConfirm = () => {
    const validQuestions = questions.filter(
      (q) => q.questionName.trim() && q.answers.length > 0
    );
    if (validQuestions.length > 0) {
      validQuestions.forEach((q) =>
        onAddQuestion({ type: "multipleChoice", name: q.questionName, answers: q.answers })
      );
      setQuestions([]);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded mb-4" style={{ color: "black" }}>
      <button
        onClick={addQuestion}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Add Question
      </button>

      {questions.map((q, index) => (
        <div key={index} className="mb-4">
          <input
            type="text"
            placeholder="Question Name"
            value={q.questionName}
            onChange={(e) => handleQuestionNameChange(index, e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mb-2"
            style={{ color: "black" }}
          />

          {q.answers.map((answer, answerIndex) => (
            <div key={answerIndex} className="flex mb-2 items-center">
              <input
                type="text"
                placeholder="Add an answer"
                value={answer}
                onChange={(e) =>
                  handleAnswerChange(index, answerIndex, e.target.value)
                }
                className="flex-grow p-2 border border-gray-300 rounded mb-2"
                style={{ color: "black" }}
              />

              <button
                onClick={() => removeAnswerField(index, answerIndex)}
                className="ml-2 p-2 bg-red-500 text-white rounded"
              >
                -
              </button>
            </div>
          ))}

          <button
            onClick={() => addAnswerField(index)}
            className="ml-2 p-2 bg-blue-500 text-white rounded"
          >
            +
          </button>
        </div>
      ))}

      <button
        onClick={handleConfirm}
        className="mt-4 p-2 bg-green-500 text-white rounded"
      >
        Confirm
      </button>
    </div>
  );
};

export default MultipleChoice;
