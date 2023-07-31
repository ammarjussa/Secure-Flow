import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  where,
  query,
} from "firebase/firestore";
import {
  Web3Button,
  useContract,
  useContractRead,
  useAddress,
} from "@thirdweb-dev/react";

import SecureFlowABI from "../../SecureFlow.abi.json";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "400px",
  },
};

const AdminDashboard: React.FC = () => {
  const [participantData, setParticipantData] = useState<any>();

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
    const fetchData = async () => {
      const dataArr: any[] = [];
      const collectionRef = collection(db, "participants");
      const qry = query(
        collectionRef,
        where("role", "!=", "Admin"),
        where("approved", "==", false)
      );
      const querySnapshot = await getDocs(qry);
      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          let obj = {
            id: doc.id,
            data: doc.data(),
          };
          dataArr.push(obj);
        });
        setParticipantData(dataArr);
      }
    };
    fetchData();
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

      {/* <Web3Button
        contractAddress={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string}
        action={(contract) => contract.call("addContract")}
        onSuccess={() => {
          console.log();
        }}
      ></Web3Button> */}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={modalStyles}
        contentLabel="Participant Details"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Participant Details
        </h2>
        {selectedParticipant && (
          <div>
            <p>Name: {selectedParticipant.data.name}</p>
            <p>Email: {selectedParticipant.data.email}</p>
            <p>Organization: {selectedParticipant.data.organization}</p>
            <p>Phone Number: {selectedParticipant.data.phoneNumber}</p>
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => handleApproveParticipant(selectedParticipant.id)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors duration-300"
          >
            Approve
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
