import { useState, useEffect } from "react";
import Chart from "chart.js/auto";

interface Props {
  data: { [product: string]: number };
}

const BarGraph: React.FC<Props> = ({ data }) => {
  useEffect(() => {
    const products = Object.keys(data);
    const levels = Object.values(data);

    const ctx = document.getElementById("productBarGraph") as HTMLCanvasElement;
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: products,
        datasets: [
          {
            label: "Product Levels",
            data: levels,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.5,
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

  return <canvas id="productBarGraph" height={200}></canvas>;
};

export default BarGraph;
