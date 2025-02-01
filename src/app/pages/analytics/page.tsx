"use client"

import { useEffect, useState } from 'react';
import SurveyChart from '@/app/components/SurveyChart';
import HomeButton from '@/app/components/HomeButton';

interface SurveyData {
  _id: {
    question: string;
    answer: string;
  };
  count: number;
}

const AnalyticsPage: React.FC = () => {
  const [chartData, setChartData] = useState<{ labels: string[]; counts: number[] }>({ labels: [], counts: [] });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/analytics');
      const data: SurveyData[] = await response.json();

      const labels = [...new Set(data.map((item) => item._id.question))];
      const counts = labels.map((label) =>
        data
          .filter((item) => item._id.question === label)
          .reduce((acc, curr) => acc + curr.count, 0)
      );

      setChartData({ labels, counts });
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '40%', height: '400px', margin: '0 auto' }}>
  <SurveyChart data={chartData} />
  <HomeButton />
    </div>
  );
};

export default AnalyticsPage;
