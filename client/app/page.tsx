"use client";

import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import AdminDashboard from "@/components/DashboardComponents/AdminDashboard";
import ProducerDashboard from "@/components/DashboardComponents/ProducerDashboard";
import RetailerDashboard from "@/components/DashboardComponents/RetailerDashboard";
import Header from "@/components/Header";

const DashboardPage: React.FC<{}> = () => {
  const { user }: any = useAuthContext();

  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    if (user === null) router.push("/login");
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "participants"));
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
    };

    fetchData();
  });

  const handleLogOut = async (e: any) => {
    e.preventDefault();
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Header page="dashboard" />
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

          {/* <AdminDashboard /> */}
          <ProducerDashboard />
          {/* <RetailerDashboard /> */}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
