import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

const SurveyChart = ({ data }: { data: { [key: string]: number } }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(0, 255, 0, 0.24)", "rgba(53, 162, 235, 0.2)", "rgba(209, 10, 192, 0.2)", "rgba(218, 221, 21, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgb(9, 255, 83)", "rgba(53, 162, 235, 1)", "rgb(250, 18, 231)", "rgb(229, 255, 0)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Pie data={chartData} />
  );
};

export default SurveyChart;
