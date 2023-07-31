import { useState, useEffect } from "react";
import Chart from "chart.js/auto";

interface Props {
  data: number[];
}

const LineGraph: React.FC<Props> = ({ data }) => {
  useEffect(() => {
    const today = new Date();
    const labels = [...Array(7)].map((_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      return day.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });

    // Chart.js configuration
    const ctx = document.getElementById("orderLineGraph") as HTMLCanvasElement;
    new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Orders in the Last 7 Days",
            data: data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [data]);

  return <canvas id="orderLineGraph" height={200}></canvas>;
};

export default LineGraph;
