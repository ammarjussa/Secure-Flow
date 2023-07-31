import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import AdminDashboard from "../components/DashboardComponents/AdminDashboard";
import ProducerDashboard from "../components/DashboardComponents/ProducerDashboard";
import RetailerDashboard from "../components/DashboardComponents/RetailerDashboard";
import Header from "../components/Header";
import WholesalerDashboard from "../components/DashboardComponents/WholesalerDashboard";

const DashboardPage: NextPage = () => {
  const { user }: any = useAuthContext();
  const [role, setRole] = useState(null);

  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    if (user === null) router.push("/login");
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      const collectionRef = collection(db, "participants");
      const qry = query(collectionRef, where("email", "==", user?.email));
      const docSnap = await getDocs(qry);
      setRole(docSnap.docs[0].data().role);
    };
    fetchUser();
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
    <div>
      <Header page="dashboard" />
      <div className="flex flex-col">
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
          {role === "Admin" ? (
            <AdminDashboard />
          ) : role === "Wholesaler" ? (
            <WholesalerDashboard user={user} />
          ) : role === "Manufacturer" ? (
            <ProducerDashboard user={user} />
          ) : role === "Retailer" ? (
            <RetailerDashboard user={user} />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
