"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import AdminDashboard from "@/components/DashboardComponents/AdminDashboard";
import ProducerDashboard from "@/components/DashboardComponents/ProducerDashboard";
import RetailerDashboard from "@/components/DashboardComponents/RetailerDashboard";
import Header from "@/components/Header";

const DashboardPage: React.FC<{}> = () => {
  const { user }: any = useAuthContext();
  const [role, setRole] = useState(null);
  const [participantData, setParticipantData] = useState<any>([]);

  const router = useRouter();
  const auth = getAuth();
  console.log(user.displayName);

  useEffect(() => {
    if (user === null) router.push("/login");
    const fetchUser = async () => {
      const collectionRef = collection(db, "participants");
      const qry = query(collectionRef, where("email", "==", user?.email));
      const docSnap = await getDocs(qry);
      setRole(docSnap.docs[0].data().role);
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "participants"));
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        setParticipantData([...participantData, doc.data()]);
      });
      console.log(participantData);
    };

    fetchData();

    return () => {
      setParticipantData([]);
    };
  }, []);

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

          {role === "Manufacturer" ? (
            <AdminDashboard data={participantData} />
          ) : null}
          {/* <ProducerDashboard /> */}

          {/* <RetailerDashboard /> */}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
