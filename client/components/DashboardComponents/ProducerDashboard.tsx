import Modal from "react-modal";
import { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
// import BarGraph from "../Charts/BarGraph";
import {
  useAddress,
  useContract,
  useContractWrite,
  useContractEvents,
} from "@thirdweb-dev/react";
import SecureFlowABI from "../../SecureFlow.abi.json";

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

// ProducerDashboard.tsx
interface Props {
  user: any;
}

const ProducerDashboard: React.FC<Props> = ({ user }) => {
  const [prodData, setProdData] = useState<any>();
  const address = useAddress();
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    SecureFlowABI
  );

  const { mutateAsync: addProduct, isLoading: isl } = useContractWrite(
    contract,
    "addProduct"
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

  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, "participants");
      const qry = query(collectionRef, where("email", "==", user?.email));
      const docSnap = await getDocs(qry);
      setProdData(docSnap.docs[0].data());
    };

    fetchData();
  }, []);

  const dummyOrders = [
    {
      id: 1,
      productName: "Product 1",
      quantity: 5,
      totalPrice: 54.95,
    },
  ];

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
    try {
      const data = await addProduct({
        args: [product.name, product.quantity, product.price, 0],
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

  return (
    <div className="p-4">
      {prodData?.approved ? (
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
                    <th className="px-4 py-2 border">Product Name</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {event?.map((product: any) => (
                    <tr key={parseInt(product?.data.productId)}>
                      <td className="px-4 py-2 border">{product?.data.name}</td>
                      <td className="px-4 py-2 border">
                        {parseInt(product?.data.quantity)}
                      </td>
                      <td className="px-4 py-2 border">
                        {parseInt(product?.data.price)}
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
                    <th className="px-4 py-2 border">Product Name</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyOrders.map((order) => (
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
          {/* 
          <div className="block w-1/2">
            <BarGraph data={productLevels} />
          </div> */}

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
