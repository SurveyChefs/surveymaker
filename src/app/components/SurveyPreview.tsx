import React from "react";
import { Question } from "../types";

interface SurveyPreviewProps {
  title: string;
  description: string;
  questions: Question[];
  onClose: () => void;
  onEditQuestion: (index: number, updatedQuestion: Question) => void;
}

const SurveyPreview: React.FC<SurveyPreviewProps> = ({
  title,
  description,
  questions,
  onClose,
  onEditQuestion,
}) => {
  const handleEditQuestion = (index: number) => {
    if (index < 0 || !questions || !questions[index]) {
      alert("Question not found!");
      return;
    }

    const updatedName = prompt("Enter the updated question name", questions[index].name);
    if (updatedName) {
      const updatedAnswers = prompt("Enter the updated answers (comma separated)", questions[index].answers?.join(","));
      if (updatedAnswers) {
        const updatedQuestion: Question = {
          ...questions[index],
          name: updatedName,
          answers: updatedAnswers.split(",").map(answer => answer.trim()),
        };
        onEditQuestion(index, updatedQuestion);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-8 rounded-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl"
        >
          <span className="text-red-600">X</span>
        </button>

        <h3 className="text-2xl font-bold mb-4">Survey Preview</h3>
        <div>
          <h4 className="font-semibold">Title:</h4>
          <p>{title}</p>
        </div>
        <div>
          <h4 className="font-semibold mt-4">Description:</h4>
          <p>{description}</p>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">Questions:</h4>
          {questions.map((q, index) => (
            <div key={index}>
              <p className="font-bold cursor-pointer text-blue-400" onClick={() => handleEditQuestion(index)}>
                {q.name}
              </p>
              <ul>
                {q.answers?.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveyPreview;
