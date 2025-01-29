import { notFound } from "next/navigation";

async function getSurvey(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/survey?id=${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function SurveyPage({ params }: { params: { id: string } }) {
  if (!/^[0-9a-fA-F]{24}$/.test(params.id)) return notFound();
  const survey = await getSurvey(params.id);
  if (!survey) return notFound();

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-gray-600 bg-gray-800 p-6 shadow-md">
          <h1 className="mb-4 text-3xl font-bold text-white">{survey.title}</h1>
          <p className="mb-8 text-lg text-gray-300">{survey.description}</p>

          <div className="space-y-6">
            {survey.questions.map((question: any, index: number) => (
              <div
                key={index}
                className="rounded-lg border border-gray-600 bg-gray-700 p-4"
              >
                <h3 className="mb-4 text-xl font-semibold text-white">
                  {question.name}
                </h3>
                
                {question.type === 'multipleChoice' && (
                  <div className="space-y-3">
                    {question.answers?.map((answer: string, ansIndex: number) => (
                      <div key={ansIndex} className="flex items-center">
                        <input
                          type="radio"
                          id={`q${index}-a${ansIndex}`}
                          name={`question-${index}`}
                          className="h-4 w-4 text-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`q${index}-a${ansIndex}`}
                          className="ml-3 text-gray-200"
                        >
                          {answer}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}