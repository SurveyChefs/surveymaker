"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeButton from "@/app/components/HomeButton";
import Navbar from "@/app/components/Navbar";

interface Survey {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function SurveysPage() {
  const router = useRouter();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/survey`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch surveys");
        }

        const data = await res.json();
        setSurveys(data);
      } catch (err) {
        setError("Error fetching surveys");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading surveys...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-gray-600 bg-gray-800 p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-blue-400 mb-6">Available Surveys</h1>
            <HomeButton />
            <div className="space-y-4">
              {surveys.length === 0 ? (
                <p className="text-gray-400">No surveys available.</p>
              ) : (
                surveys.map((survey) => (
                  <div
                    key={survey._id}
                    onClick={() => router.push(`/surveys/${survey._id}`)}
                    className="cursor-pointer rounded-lg border border-gray-600 p-4 bg-gray-700 hover:bg-gray-600 transition-all duration-200"
                  >
                    <h2 className="text-xl text-white font-semibold">{survey.title}</h2>
                    <p className="text-gray-300">{survey.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
