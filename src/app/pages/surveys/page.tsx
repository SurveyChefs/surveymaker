import Link from "next/link";

import HomeButton from "@/app/components/HomeButton";
import Navbar from "@/app/components/Navbar";
async function getSurveys() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/survey`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch surveys");
  return res.json();
}

export default async function SurveysList() {
  const surveys = await getSurveys();

  return (

    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-white">Available Surveys</h1>
        < HomeButton />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey: any) => (
            <Link
              key={survey._id}
              href={`/pages/surveys/${survey._id}`}
              className="transform transition-all duration-200 hover:scale-105"
            >
              <div className="h-full rounded-lg border border-gray-600 bg-gray-800 p-6 shadow-md hover:border-gray-500">
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <h2 className="mb-2 line-clamp-1 text-xl font-semibold text-white">
                      {survey.title}
                    </h2>
                    <p className="mb-4 line-clamp-2 text-gray-300">
                      {survey.description}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    Created: {new Date(survey.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </div>
    
  );
}