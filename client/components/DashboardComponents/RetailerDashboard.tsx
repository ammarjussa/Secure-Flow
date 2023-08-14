import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

interface Props {
  user: any;
  userData: any;
}

const chartData = {
  labels: ["Product A", "Product B", "Product C", "Product D"],
  datasets: [
    {
      label: "Amount",
      data: [200, 350, 150, 500],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
};

const chartOptions: any = {
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      type: "category", // Use category scale for the x-axis
      beginAtZero: true,
    },
  },
  maintainAspectRatio: false,
  responsive: true,
};

Chart.register(...registerables);

const RetailerDashboard: React.FC<Props> = ({ user, userData }) => {
  return (
    <div className="p-5">
      {userData?.approved ? (
        <div className="px-5 py-4">
          <div className="mt-8">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Money Earned</p>
                <p className="text-xl font-semibold">$100</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Money Spend</p>
                <p className="text-xl font-semibold">$100</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Product Sales</h2>
            <div>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      ) : (
        <p>WAIT FOR APPROVAL</p>
      )}
    </div>
  );
};

export default RetailerDashboard;
