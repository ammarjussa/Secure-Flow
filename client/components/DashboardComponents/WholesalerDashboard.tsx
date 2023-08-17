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
  const [allAdd, setAllAdd] = useState();
  const address = useAddress();
  const [order, setOrder] = useState({
    productId: "",
    seller: "",
    buyerType: 1,
    quantity: 0,
  });

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

  if (productLoad) {
    console.log("loading");
  }
  if (productErr) {
    console.log(productErr);
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

  return (
    <div className="p-4">
      {userData?.approved ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {products &&
              products
                .filter((product: any) => product?.name !== "")
                ?.map((product: any) => (
                  <tr key={product?.quantity}>
                    <td className="px-4 py-2 border">
                      {parseInt(product?.id)}
                    </td>
                    <td className="px-4 py-2 border">{product?.name}</td>
                    <td className="px-4 py-2 border">
                      {parseInt(product?.quantity)}
                    </td>
                    <td className="px-4 py-2 border">
                      {ethers.utils.formatEther(product?.price).toString()}
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
