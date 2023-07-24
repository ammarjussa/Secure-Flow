import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Props {
  user: any;
}

const RetailerDashboard: React.FC<Props> = ({ user }) => {
  const [retailData, setRetailData] = useState<any>();
  useEffect(() => {
    const fetchData = async () => {
      const collectionRef = collection(db, "participants");
      const qry = query(collectionRef, where("email", "==", user?.email));
      const docSnap = await getDocs(qry);
      setRetailData(docSnap.docs[0].data());
    };

    fetchData();
    console.log(retailData);
  }, []);
  const dummyWholesalers = [
    {
      id: 1,
      name: "Wholesaler 1",
      products: [
        {
          id: 1,
          name: "Product 1",
          stockLevel: 50,
          price: 10.99,
        },
      ],
    },
    // Add more wholesalers and their products as needed
  ];
  const dummyOrderHistory = [
    {
      id: 1,
      productName: "Product 1",
      quantity: 5,
      totalPrice: 54.95,
    },
    // Add more order history as needed
  ];
  return (
    <div className="p-4">
      {retailData?.approved ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Wholesalers List */}
            {dummyWholesalers.map((wholesaler) => (
              <div key={wholesaler.id}>
                <h3 className="text-xl font-semibold mb-2">
                  {wholesaler.name}
                </h3>
                <table className="w-full border-collapse table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Product Name</th>
                      <th className="px-4 py-2 border">Stock Level</th>
                      <th className="px-4 py-2 border">Price</th>
                      <th className="px-4 py-2 border"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {wholesaler.products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-2 border">{product.name}</td>
                        <td className="px-4 py-2 border">
                          {product.stockLevel}
                        </td>
                        <td className="px-4 py-2 border">{product.price}</td>
                        <td className="px-4 py-2 border">
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300">
                            Order Items
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Order History */}
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
        <p>WAIT FOR APPROVAL</p>
      )}
    </div>
  );
};

export default RetailerDashboard;
