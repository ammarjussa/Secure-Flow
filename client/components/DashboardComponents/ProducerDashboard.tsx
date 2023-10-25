import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { ProducerModal } from "../modals";
import { useContractContext, useFirestoreContext } from "../../providers";
import { SellerInfoModal } from "../modals/SellerInfoModal";

const DUMMY_CONVERSION = 0.603002;

Chart.register(...registerables);

interface Props {
  user: any;
  userData: any;
}

const ProducerDashboard: React.FC<Props> = ({ user, userData }) => {
  const {
    address,
    moneyEarned,
    meLoad,
    sellerProducts,
    sellerOrders,
    sellerOrdersDelivered,
    podLoad,
    podErr,
    addProduct,
    markOrderDelivered,
    modLoad,
  } = useContractContext();

  const { allWholeAddData, fetchAddressesByParticipant } =
    useFirestoreContext();

  const [labels, setLabels] = useState<any>([]);
  const [quantities, setQuantities] = useState<any>([]);
  const [orderLabels, setOrderLabels] = useState<[]>([]);
  const [orderQuantities, setOrderQuantities] = useState<[]>([]);
  const [delOrderLabels, setDelOrderLabels] = useState<[]>([]);
  const [delOrderQuantities, setDelOrderQuantities] = useState<[]>([]);

  const [currentBuyer, setCurrentBuyer] = useState<any>();
  const [buyerInfoModalOpen, setBuyerInfoModalOpen] = useState<boolean>(false);

  if (podLoad || modLoad || meLoad) {
    console.log("loading");
  }
  if (podErr) {
    console.log("Error");
  }

  useEffect(() => {
    fetchAddressesByParticipant("Wholesaler");
  });

  useEffect(() => {
    const handleData = () => {
      let lab: any = [];
      let quan: any = [];
      let orderLab: any = [];
      let orderQuan: any = [];
      let delOrderLab: any = [];
      let delOrderQuan: any = [];

      if (sellerProducts) {
        for (let product of sellerProducts) {
          lab.push(product?.name);
          quan.push(parseInt(product?.quantity));
        }
      }
      if (sellerOrders) {
        for (let order of sellerOrders) {
          orderLab.push(order?.productName);
          orderQuan.push(parseInt(order?.quantity));
        }
      }
      if (sellerOrdersDelivered) {
        for (let order of sellerOrdersDelivered) {
          delOrderLab.push(order?.productName);
          delOrderQuan.push(parseInt(order?.quantity));
        }
      }

      setLabels(lab);
      setQuantities(quan);
      setOrderLabels(orderLab);
      setOrderQuantities(orderQuan);
      setDelOrderLabels(delOrderLab);
      setDelOrderQuantities(delOrderQuan);
    };

    handleData();
  }, [sellerProducts, sellerOrders, sellerOrdersDelivered]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    quantity: 0,
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addProd = async (e: any, product: any) => {
    e.preventDefault();
    const weiPrice = ethers.utils.parseUnits(product.price, "ether");

    try {
      const data = await addProduct({
        args: [product.name, product.quantity, weiPrice, 0],
        overrides: {
          from: address,
        },
      });
      console.info("contract call success", data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  const markDelivered = async (e: any, order: any) => {
    e.preventDefault();
    try {
      const data = await markOrderDelivered({
        args: [order?.id],
        overrides: {
          from: address,
        },
      });
      console.info("contract call success", data);
      alert("Successfully Delivered");
    } catch (err) {
      console.log(err);
    }
  };

  const chartOptions: any = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        type: "category",
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between px-2">
        <div className="mb-6">
          <p className="text-xs text-gray-600">Total Money Earned</p>
          <p className="text-md">
            <span className="text-4xl font-semibold">
              {moneyEarned
                ? parseFloat(ethers.utils.formatEther(moneyEarned))
                : 0}
            </span>
            &nbsp; MATIC
          </p>
          <p className="text-md">
            ≈ $
            {moneyEarned
              ? (
                  parseFloat(ethers.utils.formatEther(moneyEarned)) *
                  DUMMY_CONVERSION
                ).toFixed(2)
              : 0}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4  py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300 float-right"
        >
          Add Product
        </button>
      </div>

      {userData?.approved ? (
        <div>
          <div className="flex flex-row items-start justify-between px-2 mb-20">
            <div className="bg-white border-gray-100 w-[48%] min-h-[330px] p-6 rounded-lg mr-18">
              <h2 className="text-2xl font-bold mb-4">My Products</h2>
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Id</th>
                    <th className="px-4 py-2 border">Product Name</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts?.map((product: any) => (
                    <tr key={parseInt(product?.id)}>
                      <td className="px-4 py-2 border">
                        {parseInt(product?.id)}
                      </td>

                      <td className="px-4 py-2 border">{product?.name}</td>
                      <td className="px-4 py-2 border">
                        {parseInt(product?.quantity)}
                      </td>
                      <td className="px-4 py-2 border">
                        {parseFloat(ethers.utils.formatEther(product?.price))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="h-80 bg-white border-gray-100 w-[48%] min-h-[330px] p-6 rounded-lg">
              <Bar
                data={{
                  labels: labels || [],
                  datasets: [
                    {
                      label: "Amount",
                      data: quantities,
                      backgroundColor: "rgba(75, 192, 192, 0.6)",
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
          <div className="flex flex-row items-start justify-between px-2 mb-20">
            <div className="bg-white border-gray-100 w-[48%] min-h-[330px] p-6 rounded-lg mr-18">
              <h2 className="text-2xl font-bold mb-4">My Pending Orders</h2>
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Id</th>
                    <th className="px-4 py-2 border">Buyer Name</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerOrders &&
                    sellerOrders
                      .filter(
                        (order: any) =>
                          order?.buyer !==
                          "0x0000000000000000000000000000000000000000"
                      )
                      ?.map((order: any) => (
                        <tr key={parseInt(order?.id)}>
                          <td className="px-4 py-2 border">
                            {parseInt(order?.id)}
                          </td>

                          <td className="px-4 py-2 border">
                            {allWholeAddData[order?.buyer]?.name}
                          </td>
                          <td className="px-4 py-2 border">
                            {parseInt(order?.quantity)}
                          </td>
                          <td className="px-4 py-2 border">
                            {parseFloat(
                              ethers.utils.formatEther(order?.amount)
                            )}
                          </td>
                          <td className="px-4 py-2 border">
                            <button
                              onClick={(e) => markDelivered(e, order)}
                              className="px-2 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
                            >
                              Delivered
                            </button>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className="h-80 bg-white border-gray-100 w-[48%] min-h-[330px] p-6 rounded-lg">
              <Bar
                data={{
                  labels: orderLabels || [],
                  datasets: [
                    {
                      label: "Amount",
                      data: orderQuantities,
                      backgroundColor: "rgba(45, 54, 132, 0.7)",
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
          <div className="flex flex-row items-start justify-between px-2 mb-20">
            <div className="bg-white border-gray-100 w-[48%] min-h-[330px] p-6 rounded-lg mr-18">
              <h2 className="text-2xl font-bold mb-4">My Delivered Orders</h2>
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Id</th>
                    <th className="px-4 py-2 border">Buyer Name</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerOrdersDelivered &&
                    sellerOrdersDelivered
                      .filter(
                        (order: any) =>
                          order?.buyer !==
                          "0x0000000000000000000000000000000000000000"
                      )
                      ?.map((order: any) => (
                        <tr key={parseInt(order?.id)}>
                          <td className="px-4 py-2 border">
                            {parseInt(order?.id)}
                          </td>

                          <td
                            className="px-4 py-2 border cursor-pointer font-bold hover:underline"
                            onClick={() => {
                              setBuyerInfoModalOpen(true);
                              setCurrentBuyer(allWholeAddData[order?.buyer]);
                            }}
                          >
                            {allWholeAddData[order?.buyer]?.name}
                          </td>
                          <td className="px-4 py-2 border">
                            {parseInt(order?.quantity)}
                          </td>
                          <td className="px-4 py-2 border">
                            {parseFloat(
                              ethers.utils.formatEther(order?.amount)
                            )}
                          </td>
                          <td className="px-4 py-2 border">
                            {order?.isDelivered ? "True" : "False"}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className="h-80 bg-white border-gray-100 min-w-[48%] min-h-[330px] p-6 rounded-lg">
              <Bar
                data={{
                  labels: delOrderLabels || [],
                  datasets: [
                    {
                      label: "Amount",
                      data: delOrderQuantities,
                      backgroundColor: "rgba(34, 233, 100, 0.9)",
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
          <ProducerModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            product={product}
            handleChange={handleChange}
            addProd={addProd}
          />
          <SellerInfoModal
            isModalOpen={buyerInfoModalOpen}
            setIsModalOpen={setBuyerInfoModalOpen}
            sellerInfo={currentBuyer}
          />
        </div>
      ) : (
        <p>WAIT FOR APPROVAL</p>
      )}
    </div>
  );
};

export default ProducerDashboard;
