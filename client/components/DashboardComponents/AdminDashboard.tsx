import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
import SecureFlowABI from "../../SecureFlow.abi.json";
import { AdminModal } from "../modals";
import { useFirestoreContext } from "../../providers";

const AdminDashboard: React.FC = () => {
  const { participantData, fetchDataByApproval } = useFirestoreContext();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    SecureFlowABI
  );
  const address = useAddress();

  // if (!address) {
  //   console.log("Wallet not connected");
  // } else {
  //   console.log(address);
  // }

  const { data, isLoading, error } = useContractRead(
    contract,
    "getAddress",
    [],
    {
      from: address,
    }
  );
  if (!isLoading) {
    console.log(data);
  }

  useEffect(() => {
    fetchDataByApproval();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  const handleViewParticipant = (participant: any) => {
    setSelectedParticipant(participant);
    setIsModalOpen(true);
  };

  const handleApproveParticipant = async (id: string) => {
    const docRef = doc(db, "participants", id);
    try {
      await setDoc(
        docRef,
        {
          approved: true,
        },
        {
          merge: true,
        }
      );

      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 mt-6 pt-6 text-center">
        Participants Waiting for Approval
      </h2>
      <ul>
        {participantData?.map((participant: any) => (
          <li
            key={participant.id}
            className="flex justify-between items-center py-2 border-b border-gray-300"
          >
            <span>{participant.data.name}</span>
            <button
              onClick={() => handleViewParticipant(participant)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
            >
              View
            </button>
          </li>
        ))}
      </ul>

      <AdminModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedParticipant={selectedParticipant}
        handleApproveParticipant={handleApproveParticipant}
      />
    </div>
  );
};

export default AdminDashboard;
