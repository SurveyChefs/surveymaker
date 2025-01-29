async function getSurvey(id: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/survey?id=${id}`, {
        cache: "no-store",
      });
  
      if (!res.ok) throw new Error("Failed to fetch survey");
      return await res.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }
  
  export default async function SurveyPage({ params }: { params: { id: string } }) {
    const survey = await getSurvey(params.id);
  
    if (!survey) return <div>Survey not found</div>;
  
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">{survey.title}</h1>
        <p className="text-lg text-gray-600 mb-8">{survey.description}</p>
        
        <div className="space-y-8">
          {survey.questions.map((question: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">{question.name}</h3>
              {question.type === 'multipleChoice' && (
                <div className="space-y-2">
                  {question.answers?.map((answer: string, ansIndex: number) => (
                    <div key={ansIndex} className="flex items-center">
                      <input 
                        type="radio" 
                        id={`q${index}-a${ansIndex}`}
                        name={`question-${index}`}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label 
                        htmlFor={`q${index}-a${ansIndex}`}
                        className="ml-2 text-gray-700"
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
    );
  }