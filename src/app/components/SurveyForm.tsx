"use client";

import React, { useState } from "react";

export default function SurveyForm() {
  const [fields, setFields] = useState([
    { name: "", email: "", age: "", feedback: "" },
  ]);

  const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFields((prev) =>
      prev.map((field, i) =>
        i === index ? { ...field, [name]: value } : field
      )
    );
  };

  //Add field
  const addField = () => {
    setFields((prev) => [
      ...prev,
      { name: "", email: "", age: "", feedback: "" }, //Make empty fields
    ]);
  };

  //Remove field
  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Fields:", fields);
  
    const apiEndpoint = "/api/submitSurveys";
    
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      });
  
      if (response.ok) {
        alert("Form submitted successfully!");
        console.log("Submitted Fields:", fields);
      } else {
        alert("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold">Reactive Survey Test</h1>

      {fields.map((field, index) => (
        <div key={index} className="border border-gray-700 p-4 rounded space-y-4 bg-gray-800">
          <h2 className="text-lg font-semibold">Entry {index + 1}</h2>
          <div>
            <label className="block mb-1 text-sm" htmlFor={`name-${index}`}>
              Name
            </label>
            <input
              type="text"
              id={`name-${index}`}
              name="name"
              value={field.name}
              onChange={(e) => handleFieldChange(index, e)}
              className="w-full p-2 border border-gray-600 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm" htmlFor={`email-${index}`}>
              Email
            </label>
            <input
              type="email"
              id={`email-${index}`}
              name="email"
              value={field.email}
              onChange={(e) => handleFieldChange(index, e)}
              className="w-full p-2 border border-gray-600 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm" htmlFor={`age-${index}`}>
              Age
            </label>
            <select
              id={`age-${index}`}
              name="age"
              value={field.age}
              onChange={(e) => handleFieldChange(index, e)}
              className="w-full p-2 border border-gray-600 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select age</option>
              {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
                <option key={age} value={age.toString()}>
                  {age}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm" htmlFor={`feedback-${index}`}>
              Feedback
            </label>
            <textarea
              id={`feedback-${index}`}
              name="feedback"
              value={field.feedback}
              onChange={(e) => handleFieldChange(index, e)}
              className="w-full p-2 border border-gray-600 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter feedback"
              required
            />
          </div>

          <button
            type="button"
            onClick={() => removeField(index)}
            className="text-red-500 hover:underline text-sm"
          >
            Remove Entry
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        className="px-4 py-2 mr-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add More Fields
      </button>

      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Submit
      </button>
    </form>
  );
}
