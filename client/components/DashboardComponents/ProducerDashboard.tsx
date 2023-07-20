"use client";

import React, { useState } from "react";
import Modal from "react-modal";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "400px", // Limit the width of the modal
  },
};

// ProducerDashboard.tsx

const ProducerDashboard: React.FC = () => {
  // Dummy data for demonstration purposes
  const dummyProducts = [
    {
      id: 1,
      name: "Product 1",
      stockLevel: 50,
      price: 10.99,
    },
    // Add more products as needed
  ];

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
    stockLevel: 0,
    price: 0,
  });

  const [products, setProducts] = useState(dummyProducts);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = products.length + 1;
    setProducts([...products, { ...product, id }]);
    setProduct({ name: "", stockLevel: 0, price: 0 });
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
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
                <th className="px-4 py-2 border">Stock Level</th>
                <th className="px-4 py-2 border">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 border">{product.name}</td>
                  <td className="px-4 py-2 border">{product.stockLevel}</td>
                  <td className="px-4 py-2 border">{product.price}</td>
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={modalStyles}
        contentLabel="Add Product"
      >
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label htmlFor="stockLevel" className="block font-medium mb-2">
              Stock Level
            </label>
            <input
              type="number"
              id="stockLevel"
              name="stockLevel"
              value={product.stockLevel}
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
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
            >
              Add Product
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
  );
};

export default ProducerDashboard;
