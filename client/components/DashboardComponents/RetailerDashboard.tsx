import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import SecureFlowABI from "../../SecureFlow.abi.json";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { WholesalerModal } from "../modals";
import { useContractContext, useFirestoreContext } from "../../providers";
import { SellerInfoModal } from "../modals/SellerInfoModal";

const DUMMY_CONVERSION = 0.603002;
interface Props {
  user: any;
  userData: any;
}

Chart.register(...registerables);

const RetailerDashboard: React.FC<Props> = ({ userData }) => {
  const {
    address,
    buyerOrders,
    woLoad,
    woErr,
    placeOrder,
    pOrderLoad,
    moneyEarned,
    moneySpent,
    sellerProducts,
    sellerOrders,
    poLoad,
    poErr,
    sellerOrdersDelivered,
    podLoad,
    podErr,
  } = useContractContext();
  const {
    allWholeAdd,
    allWholeAddData,
    fetchAddressesByParticipant,
    allConsumerAddData,
  } = useFirestoreContext();

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
  const [productLabels, setProductLabels] = useState<[]>();
  const [productQuantities, setProductQuantities] = useState<[]>();
  const [orderLabels, setOrderLabels] = useState<[]>([]);
  const [orderQuantities, setOrderQuantities] = useState<[]>([]);
  const [delOrderLabels, setDelOrderLabels] = useState<[]>([]);
  const [delOrderQuantities, setDelOrderQuantities] = useState<[]>([]);

  useEffect(() => {
    fetchAddressesByParticipant("Wholesaler");
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
  } = useContractRead(contract, "getProductsDataParticipants", [allWholeAdd]);

  if (productLoad || woLoad || pOrderLoad || poLoad || podLoad) {
    console.log("loading");
  }
  if (productErr || woErr) {
    console.log("Error");
  }

  useEffect(() => {
    const handleData = () => {
      let lab: any = [];
      let quan: any = [];
      let productLab: any = [];
      let productQuan: any = [];
      let orderLab: any = [];
      let orderQuan: any = [];
      let delOrderLab: any = [];
      let delOrderQuan: any = [];

      if (buyerOrders) {
        for (let order of buyerOrders) {
          lab.push(order?.productName);
          quan.push(parseInt(order?.quantity));
        }
      }

      if (sellerProducts) {
        for (let product of sellerProducts) {
          if (product.name !== "") {
            productLab.push(product?.name);
            productQuan.push(parseInt(product?.quantity));
          }
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
      setProductLabels(productLab);
      setProductQuantities(productQuan);
      setOrderLabels(orderLab);
      setOrderQuantities(orderQuan);
      setDelOrderLabels(delOrderLab);
      setDelOrderQuantities(delOrderQuan);
    };

    handleData();
  }, [buyerOrders, sellerProducts, sellerOrders, sellerOrdersDelivered]);

  console.log(productLabels);

  const handleProductData = (products: any) => {
    let productsArr = [];
    let newProducts = products.filter((product: any) => product.name !== "");
    for (let prod of newProducts) {
      let newProd: any = {};
      newProd = prod;
      newProd = { ...newProd, sellerName: "" };
      for (const [key, value] of Object.entries(allWholeAddData)) {
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
          <div className="flex flex-row justify-start">
            <div className="mb-6 mr-40">
              <p className="text-xs text-gray-600">Total Money Spent</p>
              <p className="text-md">
                <span className="text-4xl font-semibold">
                  {moneySpent
                    ? parseFloat(ethers.utils.formatEther(moneySpent))
                    : 0}
                </span>
                &nbsp; MATIC
              </p>
              <p className="text-md">
                ≈ $
                {(moneySpent
                  ? parseFloat(ethers.utils.formatEther(moneySpent)) *
                    DUMMY_CONVERSION
                  : 0
                ).toFixed(2)}
              </p>
            </div>
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
                {(moneyEarned
                  ? parseFloat(ethers.utils.formatEther(moneyEarned))
                  : 0 * DUMMY_CONVERSION
                ).toFixed(2)}
              </p>
            </div>
          </div>
          <div className="bg-white border-gray-100 p-6 rounded-lg mb-20">
            <h2 className="text-2xl font-bold mb-4">Available Products</h2>
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Seller Name</th>
                  <th className="px-4 py-2 border">Product Name</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Order</th>
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
                            allWholeAddData[product?.manufacturer]
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
                      <td className="px-4 py-2 border flex justify-center">
                        <button
                          className="px-2 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
                          onClick={() => {
                            setCurrentProduct(product);
                            setIsModalOpen(true);
                          }}
                        >
                          Order Items
                        </button>
                      </td>
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
                    <th className="px-4 py-2 border">Seller Name</th>
                    <th className="px-4 py-2 border">Quantity</th>
                    <th className="px-4 py-2 border">Amount</th>
                    <th className="px-4 py-2 border">Delivered</th>
                  </tr>
                </thead>
                <tbody>
                  {buyerOrders &&
                    buyerOrders
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

                          <td
                            className="px-4 py-2 border cursor-pointer font-bold hover:underline"
                            onClick={() => {
                              setSellerInfoModalOpen(true);
                              setCurrentSeller(allWholeAddData[order?.seller]);
                            }}
                          >
                            {allWholeAddData &&
                              allWholeAddData[order?.seller]?.name}
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
                  {sellerProducts &&
                    sellerProducts
                      .filter((product: any) => product.name !== "")
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
                            {parseFloat(
                              ethers.utils.formatEther(product?.price)
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className="h-80 bg-white border-gray-100 w-[48%] min-h-[330px] p-6 rounded-lg">
              <Bar
                data={{
                  labels: productLabels || [],
                  datasets: [
                    {
                      label: "Amount",
                      data: productQuantities,
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
                            {allConsumerAddData[order?.buyer]?.name}
                            order?.buyer
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
                              // onClick={(e) => markDelivered(e, order)}
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
                            // onClick={() => {
                            //   setBuyerInfoModalOpen(true);
                            //   setCurrentBuyer(allWholeAddData[order?.buyer]);
                            // }}
                          >
                            {allConsumerAddData &&
                              allConsumerAddData[order?.buyer]?.name}
                            {order?.buyer}
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

export default RetailerDashboard;
