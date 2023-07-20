"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import firebase_app from "@/firebase/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";

const auth = getAuth(firebase_app);

const ParticipantForm: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [participant, setParticipant] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    organization: "Secure Organization",
    address: "",
    city: "",
    country: "",
    role: "",
    certification: "",
    productCategory: "",
    approved: false,
    walletAddress: null,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setParticipant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        participant.email,
        password
      );

      if (result) {
        console.log(result);
        await addDoc(collection(db, "participants"), {
          ...participant,
        });
      }

      setParticipant({
        name: "",
        email: "",
        phoneNumber: "",
        organization: "Secure Organization",
        address: "",
        city: "",
        country: "",
        role: "",
        certification: "",
        productCategory: "",
        approved: false,
        walletAddress: null,
      });

      console.log("Added participant successfully");
      router.push("/");
    } catch (err: any) {
      console.log(err);
      alert(err?.message);
    }
  };

  return (
    <div className="flex justify-center">
      <form className="max-w-3xl w-full bg-white p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Participant Form
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-1" htmlFor="name">
              Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              type="text"
              id="name"
              name="name"
              value={participant.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              type="email"
              id="email"
              name="email"
              value={participant.email as any}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="organization">
              Password
            </label>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={participant.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="address">
              Address
            </label>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              type="text"
              id="address"
              name="address"
              value={participant.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="city">
              City
            </label>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              type="text"
              id="city"
              name="city"
              value={participant.city}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="country">
              Country
            </label>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              type="text"
              id="country"
              name="country"
              value={participant.country}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="role">
              Role
            </label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              id="role"
              name="role"
              value={participant.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="Manufacturer">Manufacturer</option>
              <option value="Supplier">Supplier</option>
              <option value="Wholesaler">Wholesaler</option>
              <option value="Retailer">Retailer</option>
            </select>
          </div>
          <div>
            <label className="block mb-1" htmlFor="certification">
              Certification
            </label>
            <input
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              type="text"
              id="certification"
              name="certification"
              value={participant.certification}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1" htmlFor="productCategory">
              Product Category
            </label>
            <select
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              id="productCategory"
              name="productCategory"
              value={participant.productCategory}
              onChange={handleChange}
              required
            >
              <option value="">Select Product Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food and Beverage">Food and Beverage</option>
              {/* Add other product categories */}
            </select>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 mt-10  rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParticipantForm;
