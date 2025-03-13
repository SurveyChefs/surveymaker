import Link from "next/link";
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">Available Surveys</h1>
          <p className="text-xl text-gray-300">
            Choose from our collection of surveys and share your valuable feedback
          </p>
        </div>

        {/* Survey Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {surveys.map((survey: any) => (
            <Link
              key={survey._id}
              href={`/pages/surveys/${survey._id}`}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative h-full rounded-xl border border-gray-700 bg-gray-800/90 p-6 backdrop-blur-sm shadow-lg transition duration-300 group-hover:-translate-y-1">
                <div className="flex flex-col h-full">
                  {/* Survey Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <svg 
                        className="w-6 h-6 text-blue-400" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Survey Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition duration-200">
                      {survey.title}
                    </h2>
                    <p className="text-gray-400 mb-6 line-clamp-3">
                      {survey.description}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400">
                      Created: {new Date(survey.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-blue-400 group-hover:translate-x-1 transition duration-200">
                      Take Survey
                      <svg 
                        className="w-4 h-4 ml-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {surveys.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Surveys Available</h3>
            <p className="text-gray-500">Check back later for new surveys</p>
          </div>
        )}
      </div>
    </div>
  );
}