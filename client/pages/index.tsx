import { NextPage } from "next";
import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import AdminDashboard from "../components/DashboardComponents/AdminDashboard";
import ProducerDashboard from "../components/DashboardComponents/ProducerDashboard";
import RetailerDashboard from "../components/DashboardComponents/RetailerDashboard";
import Header from "../components/Header";
import WholesalerDashboard from "../components/DashboardComponents/WholesalerDashboard";
import Sidebar from "../components/Sidebar";
import { useFirestoreContext } from "../providers";

const DashboardPage: NextPage = () => {
  const { user }: any = useAuthContext();
  const { userData, fetchUserByEmail } = useFirestoreContext();

  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    if (user === null) router.push("/login");
  }, [user]);

  useEffect(() => {
    fetchUserByEmail(user);
  }, []);

  const handleLogOut = async (e: any) => {
    e.preventDefault();
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-h-screen overflow-hidden">
      <Header page="dashboard" />
      <div className="flex">
        <Sidebar user={userData} />
        <main className="flex-grow p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-semibold">Dashboard</h1>
              <p className="text-gray-500 mt-2">
                Welcome back, {userData?.name}!
              </p>
            </div>

            <button
              onClick={handleLogOut}
              className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-3xl focus:outline-none focus:shadow-outline"
            >
              Sign Out
            </button>
          </div>
          <div className="mt-6 h-[calc(100vh-200px)] overflow-auto">
            {userData?.role === "Admin" ? (
              <AdminDashboard />
            ) : userData?.role === "Wholesaler" ? (
              <WholesalerDashboard user={user} userData={userData} />
            ) : userData?.role === "Manufacturer" ? (
              <ProducerDashboard user={user} userData={userData} />
            ) : userData?.role === "Retailer" ? (
              <RetailerDashboard user={user} userData={userData} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
