import Modal from "react-modal";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  useAddress,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import SecureFlowABI from "../../SecureFlow.abi.json";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const DUMMY_VALUE = 100;
const DUMMY_CONVERSION = 0.603002;

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "400px",
  },
};

Chart.register(...registerables);

// ProducerDashboard.tsx
interface Props {
  user: any;
  userData: any;
}

const ProducerDashboard: React.FC<Props> = ({ user, userData }) => {
  const address = useAddress();
  const [labels, setLabels] = useState<[]>();
  const [quantities, setQuantities] = useState<[]>();
  const [orderLabels, setOrderLabels] = useState<[]>();
  const [orderQuantities, setOrderQuantities] = useState<[]>();
  const [delOrderLabels, setDelOrderLabels] = useState<[]>();
  const [delOrderQuantities, setDelOrderQuantities] = useState<[]>();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    SecureFlowABI
  );

  const { mutateAsync: addProduct, isLoading: isl } = useContractWrite(
    contract,
    "addProduct"
  );

  const { mutateAsync: markOrderDelivered, isLoading: islm } = useContractWrite(
    contract,
    "markOrderDelivered"
  );

  const {
    data: products,
    isLoading: productLoad,
    error: productErr,
  } = useContractRead(contract, "getProductsData", [address]);

  const {
    data: orders,
    isLoading: orderLoad,
    error: orderErr,
  } = useContractRead(contract, "getSellerOrdersData", [address]);

  const {
    data: ordersDel,
    isLoading: delLoad,
    error: delError,
  } = useContractRead(contract, "getSellerOrdersDataDelivered", [address]);

  if (productLoad || orderLoad || delLoad) {
    console.log("loading");
  }
  if (productErr || orderErr || delError) {
    console.log("Error");
  }

  const trimAddress = (address: string) => {
    return address?.slice(0, 5) + "...." + address?.slice(-5);
  };

  useEffect(() => {
    const handleData = () => {
      let lab: any = [];
      let quan: any = [];
      let orderLab: any = [];
      let orderQuan: any = [];
      let delOrderLab: any = [];
      let delOrderQuan: any = [];

      if (products) {
        for (let product of products) {
          lab.push(product?.name);
          quan.push(parseInt(product?.quantity));
        }
      }
      if (orders) {
        for (let order of orders) {
          orderLab.push(order?.productName);
          orderQuan.push(parseInt(order?.quantity));
        }
      }
      if (ordersDel) {
        for (let order of ordersDel) {
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
  }, [products]);

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
    console.log(order, address);
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
            <span className="text-4xl font-semibold">{DUMMY_VALUE}</span>&nbsp;
            MATIC
          </p>
          <p className="text-md">
            ≈ ${(DUMMY_VALUE * DUMMY_CONVERSION).toFixed(2)}
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
            <div className="bg-white border-gray-100 min-w-[45%] min-h-[330px] p-6 rounded-lg mr-18">
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
                  {products?.map((product: any) => (
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
            <div className="h-80 bg-white border-gray-100 min-w-[45%] min-h-[330px] p-6 rounded-lg">
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
            <div className="bg-white border-gray-100 min-w-[45%] min-h-[330px] p-6 rounded-lg mr-18">
              <h2 className="text-2xl font-bold mb-4">My Pending Orders</h2>
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Id</th>
                    <th className="px-4 py-2 border">Buyer Address</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders
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
                            {trimAddress(order?.buyer)}
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
                          <button
                            onClick={(e) => markDelivered(e, order)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
                          >
                            Mark Delivered
                          </button>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className="h-80 bg-white border-gray-100 min-w-[45%] min-h-[330px] p-6 rounded-lg">
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
            <div className="bg-white border-gray-100 min-w-[45%] min-h-[330px] p-6 rounded-lg mr-18">
              <h2 className="text-2xl font-bold mb-4">My Delivered Orders</h2>
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Id</th>
                    <th className="px-4 py-2 border">Buyer Address</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersDel &&
                    ordersDel
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
                            {trimAddress(order?.buyer)}
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
            <div className="h-80 bg-white border-gray-100 min-w-[45%] min-h-[330px] p-6 rounded-lg">
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

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={modalStyles}
            contentLabel="Add Product"
            ariaHideApp={false}
          >
            <h2 className="text-2xl font-bold mb-4">Add Product</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block font-medium mb-2">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={(e: any) => addProd(e, product)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
                >
                  Approve
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-300 ml-4"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        </div>
      ) : (
        <p>WAIT FOR APPROVAL</p>
      )}
    </div>
  );
};

export default ProducerDashboard;
