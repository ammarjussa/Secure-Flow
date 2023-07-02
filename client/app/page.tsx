"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";

const DashboardPage: React.FC<{}> = () => {
  const { user }: any = useAuthContext();
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    if (user === null) router.push("/login");
  }, [user]);

  const handleLogOut = async (e: any) => {
    e.preventDefault();
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-grow p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold mb-4">
            Welcome to the SecureFlow Dashboard
          </h2>

          <button
            onClick={handleLogOut}
            className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-3xl focus:outline-none focus:shadow-outline"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">Total Orders</h3>
            <p className="text-gray-700">500</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">Pending Orders</h3>
            <p className="text-gray-700">30</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">Completed Orders</h3>
            <p className="text-gray-700">470</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">Revenue</h3>
            <p className="text-gray-700">$10,000</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
