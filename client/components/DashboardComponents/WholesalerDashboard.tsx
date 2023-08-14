import { useState, useEffect } from "react";
import Modal from "react-modal";
import { ethers } from "ethers";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  useAddress,
  useContract,
  useContractWrite,
  useContractEvents,
} from "@thirdweb-dev/react";
import SecureFlowABI from "../../SecureFlow.abi.json";
import Sidebar from "../Sidebar";

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

const WholesalerDashboard: React.FC<Props> = ({ user, userData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const address = useAddress();
  const [order, setOrder] = useState({
    productId: "",
    seller: "",
    buyerType: 1,
    quantity: 0,
  });

	useEffect(()=> {
		
	})

  const [currentProduct, setCurrentProduct] = useState();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    SecureFlowABI
  );

  const {
    data: event,
    isLoading,
    error,
  } = useContractEvents(contract, "ProductAdded");
  if (isLoading) {
    console.log("loading");
  }
  if (error) {
    console.log(error);
  }

  const { mutateAsync: addProduct, isLoading: isl } = useContractWrite(
    contract,
    "placeOrder"
  );

  const dummyOrderHistory = [
    {
      id: 1,
      productName: "Product 1",
      quantity: 5,
      totalPrice: 54.95,
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrder((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const call = async (e: any, order: any, product: any) => {
    e.preventDefault();
    // const ethValue = ethers.utils.formatEther(
    //   parseInt(product.price) * parseInt(order.quantity)
    // );
    // console.log(ethValue, order.quantity, product.productId);

    // try {
    //   const data = await addProduct({
    //     args: [
    //       parseInt(product.productId),
    //       order.seller,
    //       1,
    //       parseInt(order.quantity),
    //     ],
    //     overrides: {
    //       from: address,
    //       value: ethers.utils.parseEther(ethValue),
    //     },
    //   });
    //   console.info("contract call success", data);
    //   setIsModalOpen(false);
    // } catch (err) {
    //   console.error("contract call failure", err);
    // }
  };

  return (
    <div className="p-4">
      {userData?.approved ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {(event as any)?.map((product: any) => (
              <tr key={parseInt(product?.data.productId)}>
                <td className="px-4 py-2 border">
                  {parseInt(product?.data.productId)}
                </td>
                <td className="px-4 py-2 border">{product?.data.name}</td>
                <td className="px-4 py-2 border">
                  {parseInt(product?.data.quantity)}
                </td>
                <td className="px-4 py-2 border">
                  {parseInt(product?.data.price)}
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
                <label htmlFor="seller" className="block font-medium mb-2">
                  Seller Address
                </label>
                <input
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
                  onClick={(e: any) =>
                    call(e, order, (currentProduct as any)?.data)
                  }
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

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Order History</h2>
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Product Name</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {dummyOrderHistory.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2 border">{order.productName}</td>
                    <td className="px-4 py-2 border">{order.quantity}</td>
                    <td className="px-4 py-2 border">{order.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p>WAIT FOR APPROVAL BY ADMIN</p>
      )}
    </div>
  );
};

export default WholesalerDashboard;
