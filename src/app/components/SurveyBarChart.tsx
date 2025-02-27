import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SurveyBarChart = ({ data }: { data: { [key: string]: number } }) => {
  const answers = Object.keys(data);

  const backgroundColors = [
    "rgba(75, 192, 192, 0.2)",
    "rgba(0, 255, 0, 0.24)",
    "rgba(53, 162, 235, 0.2)",
    "rgba(209, 10, 192, 0.2)",
    "rgba(218, 221, 21, 0.2)",
  ];
  const borderColors = [
    "rgba(75, 192, 192, 1)",
    "rgb(9, 255, 83)",
    "rgba(53, 162, 235, 1)",
    "rgb(250, 18, 231)",
    "rgb(229, 255, 0)",
  ];

  const chartData = {
    labels: ["Answers"], 
    datasets: answers.map((answer, index) => ({
      label: answer,
      data: [data[answer]],
      backgroundColor: backgroundColors[index % backgroundColors.length],
      borderColor: borderColors[index % borderColors.length],
      borderWidth: 1,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
    
      tooltip: {
        callbacks: {
          title: () => "", 
          label: (context: any) => {

            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
      legend: {
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Survey Bar Chart",
        color: "white",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default SurveyBarChart;
