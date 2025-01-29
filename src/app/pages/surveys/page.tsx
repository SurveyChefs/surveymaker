import Link from "next/link";

async function getSurveys() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/survey`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch surveys");
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export default async function SurveysList() {
  const surveys = await getSurveys();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Available Surveys</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {surveys.map((survey: any) => (
          <Link 
            key={survey._id}
            href={`/pages/surveys/${survey._id}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold mb-2">{survey.title}</h2>
            <p className="text-gray-600">{survey.description}</p>
            <div className="mt-4 text-sm text-gray-500">
              Created: {new Date(survey.createdAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}