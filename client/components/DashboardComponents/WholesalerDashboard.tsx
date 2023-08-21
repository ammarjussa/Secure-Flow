import { useState, useEffect } from "react";
import Modal from "react-modal";
import { ethers } from "ethers";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  useAddress,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import SecureFlowABI from "../../SecureFlow.abi.json";
import Sidebar from "../Sidebar";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

interface Props {
  user: any;
  userData: any;
}

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

const WholesalerDashboard: React.FC<Props> = ({ user, userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allAdd, setAllAdd] = useState();
  const address = useAddress();
  const [order, setOrder] = useState({
    productId: "",
    seller: "",
    buyerType: 1,
    quantity: 0,
  });

  const [labels, setLabels] = useState<[]>();
  const [quantities, setQuantities] = useState<[]>();

  const trimAddress = (address: string) => {
    return address?.slice(0, 5) + "...." + address?.slice(-5);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const collectionRef = collection(db, "participants");
      const qry = query(collectionRef, where("role", "==", "Manufacturer"));
      const querySnapshot = await getDocs(qry);
      const addrs: any = [];
      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          addrs.push(doc.data().walletAddress);
        });
      }
      setAllAdd(addrs);
    };
    fetchUsers();
  }, []);

  const [currentProduct, setCurrentProduct] = useState();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    SecureFlowABI
  );

  const {
    data: products,
    isLoading: productLoad,
    error: productErr,
  } = useContractRead(contract, "getProductsDataParticipants", [allAdd]);

  const {
    data: orders,
    isLoading: orderLoad,
    error: orderErr,
  } = useContractRead(contract, "getBuyerOrdersData", [address]);

  if (productLoad || orderLoad) {
    console.log("loading");
  }
  if (productErr || orderErr) {
    console.log("Error");
  }

  const { mutateAsync: addProduct, isLoading: isl } = useContractWrite(
    contract,
    "placeOrder"
  );

  useEffect(() => {
    const handleData = () => {
      let lab: any = [];
      let quan: any = [];

      if (orders) {
        for (let order of orders) {
          lab.push(order?.name);
          quan.push(parseInt(order?.quantity));
        }
      }

      setLabels(lab);
      setQuantities(quan);
    };

    handleData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const call = async (e: any, order: any, product: any) => {
    e.preventDefault();
    const ethValue = ethers.utils.formatEther(
      BigInt(product.price) * BigInt(order.quantity)
    );

    try {
      const data = await addProduct({
        args: [parseInt(product.id), order.seller, 1, parseInt(order.quantity)],
        overrides: {
          from: address,
          value: ethers.utils.parseEther(ethValue),
        },
      });
      console.info("contract call success", data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("contract call failure", err);
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
    <div className="p-4">
      {userData?.approved ? (
        <div>
          <div className="bg-white border-gray-100 min-w-[45%] min-h-[330px] p-6 rounded-lg mb-20">
            <h2 className="text-2xl font-bold mb-4">Available Products</h2>
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
                {products &&
                  products
                    .filter((product: any) => product?.name !== "")
                    ?.map((product: any) => (
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
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
                          onClick={() => {
                            setCurrentProduct(product);
                            setIsModalOpen(true);
                          }}
                        >
                          Order Items
                        </button>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-row items-start justify-between px-2 mb-20">
            <div className="bg-white border-gray-100 min-w-[45%] min-h-[330px] p-6 rounded-lg mr-18">
              <h2 className="text-2xl font-bold mb-4">My Orders</h2>
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Id</th>
                    <th className="px-4 py-2 border">Seller Address</th>
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
                            {trimAddress(order?.seller)}
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
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={modalStyles}
            contentLabel="Add Product"
            ariaHideApp={false}
          >
            <h2 className="text-2xl font-bold mb-4">Order Product</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="seller" className="block font-medium mb-2">
                  Seller Address
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  type="text"
                  id="seller"
                  name="seller"
                  value={order.seller}
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
                  value={order.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={(e: any) => call(e, order, currentProduct as any)}
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
        <p>WAIT FOR APPROVAL BY ADMIN</p>
      )}
    </div>
  );
};

export default WholesalerDashboard;
