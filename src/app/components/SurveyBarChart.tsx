import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SurveyBarChart = ({ data }: { data: { [key: string]: number } }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Survey Results",
        data: Object.values(data),
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(0, 255, 0, 0.24)",
          "rgba(53, 162, 235, 0.2)",
          "rgba(209, 10, 192, 0.2)",
          "rgba(218, 221, 21, 0.2)"
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgb(9, 255, 83)",
          "rgba(53, 162, 235, 1)",
          "rgb(250, 18, 231)",
          "rgb(229, 255, 0)"
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white"
        }
      },
      title: {
        display: true,
        text: "Survey Bar Chart",
        color: "white"
      }
    },
    scales: {
      x: {
        ticks: {
          color: "white"
        }
      },
      y: {
        ticks: {
          color: "white"
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default SurveyBarChart;
