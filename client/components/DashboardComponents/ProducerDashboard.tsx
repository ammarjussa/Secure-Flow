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
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    SecureFlowABI
  );

  const { mutateAsync: addProduct, isLoading: isl } = useContractWrite(
    contract,
    "addProduct"
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
  } = useContractRead(contract, "getOrdersData", [address]);

  if (productLoad || orderLoad) {
    console.log("loading");
  }
  if (productErr || orderErr) {
    console.log("Error");
  }

  useEffect(() => {
    const handleData = () => {
      let lab: any = [];
      let quan: any = [];
      if (products) {
        for (let product of products) {
          lab.push(product?.name);
          quan.push(parseInt(product?.quantity));
        }
      }
      setLabels(lab);
      setQuantities(quan);
    };

    console.log(quantities);
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

  const call = async (e: any, product: any) => {
    e.preventDefault();
    const weiPrice = ethers.utils.parseUnits(product.price, "ether");
    console.log(product);

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
    // maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="p-4">
      {userData?.approved ? (
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300 float-right"
          >
            Add Product
          </button>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6">
            <div>
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
            <div>
              <h2 className="text-2xl font-bold mb-4">My Orders</h2>
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Id</th>
                    <th className="px-4 py-2 border">Buyer Address</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order: any) => (
                    <tr key={parseInt(order?.id)}>
                      <td className="px-4 py-2 border">
                        {parseInt(order?.id)}
                      </td>

                      <td className="px-4 py-2 border">{order?.buyer}</td>
                      <td className="px-4 py-2 border">
                        {parseInt(order?.quantity)}
                      </td>
                      <td className="px-4 py-2 border">
                        {parseFloat(ethers.utils.formatEther(order?.amount))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
            // data={chartData}
            options={chartOptions}
          />

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
                  onClick={(e: any) => call(e, product)}
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
