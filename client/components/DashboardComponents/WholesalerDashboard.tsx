import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import SecureFlowABI from "../../SecureFlow.abi.json";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { WholesalerModal } from "../modals";
import { useContractContext, useFirestoreContext } from "../../providers";
import { SellerInfoModal } from "../modals/SellerInfoModal";

interface Props {
  user: any;
  userData: any;
}

Chart.register(...registerables);

const WholesalerDashboard: React.FC<Props> = ({ userData }) => {
  const { address, wholesaleOrders, woLoad, woErr, placeOrder, pOrderLoad } =
    useContractContext();
  const { allProdAdd, allProdAddData, fetchAddressesByParticipant } =
    useFirestoreContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sellerInfoModalOpen, setSellerInfoModalOpen] =
    useState<boolean>(false);
  const [order, setOrder] = useState({
    productId: "",
    buyerType: 1,
    quantity: 0,
  });

  const [showProduct, setShowProduct] = useState<any>();
  const [currentSeller, setCurrentSeller] = useState<any>();

  const [labels, setLabels] = useState<[]>();
  const [quantities, setQuantities] = useState<[]>();

  const trimAddress = (address: string) => {
    return address?.slice(0, 5) + "...." + address?.slice(-5);
  };

  useEffect(() => {
    fetchAddressesByParticipant("Manufacturer");
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
  } = useContractRead(contract, "getProductsDataParticipants", [allProdAdd]);

  if (productLoad || woLoad || pOrderLoad) {
    console.log("loading");
  }
  if (productErr || woErr) {
    console.log("Error");
  }

  useEffect(() => {
    const handleData = () => {
      let lab: any = [];
      let quan: any = [];

      if (wholesaleOrders) {
        for (let order of wholesaleOrders) {
          console.log(order);
          lab.push(order?.productName);
          quan.push(parseInt(order?.quantity));
        }
      }

      setLabels(lab);
      setQuantities(quan);
    };

    handleData();
  }, [wholesaleOrders]);

  // console.log(labels, quantities);

  const handleProductData = (products: any) => {
    let productsArr = [];
    let newProducts = products.filter((product: any) => product.name !== "");
    for (let prod of newProducts) {
      let newProd: any = {};
      newProd = prod;
      newProd = { ...newProd, sellerName: "" };
      for (const [key, value] of Object.entries(allProdAddData)) {
        if (newProd.manufacturer === key) {
          newProd.sellerName = (value as any)?.name;
        }
      }
      productsArr.push(newProd);
    }

    setShowProduct(productsArr);
  };

  useEffect(() => {
    products && handleProductData(products);
  }, [products]);

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
      const data = await placeOrder({
        args: [
          parseInt(product.id),
          product?.manufacturer,
          1,
          parseInt(order.quantity),
        ],
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
                  <th className="px-4 py-2 border">Seller Name</th>
                  <th className="px-4 py-2 border">Product Name</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Price</th>
                </tr>
              </thead>
              <tbody>
                {products &&
                  showProduct?.map((product: any) => (
                    <tr key={product?.id + product?.manufacturer}>
                      <td
                        className="px-4 py-2 border font-bold cursor-pointer hover:underline"
                        onClick={() => {
                          setSellerInfoModalOpen(true);
                          setCurrentSeller(
                            allProdAddData[product?.manufacturer]
                          );
                        }}
                      >
                        {product?.sellerName}
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
            <div className="bg-white border-gray-100 w-[48%] min-h-[330px] py-6 px-2 rounded-lg mr-18">
              <h2 className="text-2xl font-bold mb-4">My Orders</h2>
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Product</th>
                    <th className="px-4 py-2 border">Seller Address</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {wholesaleOrders &&
                    wholesaleOrders
                      .filter(
                        (order: any) =>
                          order?.buyer !==
                          "0x0000000000000000000000000000000000000000"
                      )
                      ?.map((order: any) => (
                        <tr key={order?.id + order?.seller}>
                          <td className="px-4 py-2 border">
                            {order?.productName}
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
          <WholesalerModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            order={order}
            currentProduct={currentProduct}
            handleChange={handleChange}
            call={call}
          />
          <SellerInfoModal
            isModalOpen={sellerInfoModalOpen}
            setIsModalOpen={setSellerInfoModalOpen}
            sellerInfo={currentSeller}
          />
        </div>
      ) : (
        <p>WAIT FOR APPROVAL BY ADMIN</p>
      )}
    </div>
  );
};

export default WholesalerDashboard;
