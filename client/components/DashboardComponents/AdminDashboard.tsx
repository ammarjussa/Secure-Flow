"use client";

// AdminDashboard.tsx

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

const AdminDashboard: React.FC = () => {
  // Dummy data for demonstration purposes
  const dummyParticipants = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      organization: "XYZ Corp",
      phoneNumber: "1234567890",
      // Add other participant fields
    },
    // Add more participants as needed
  ];

  // State to manage the modal visibility and selected participant
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  // Function to open the modal and set the selected participant
  const handleViewParticipant = (participant: any) => {
    setSelectedParticipant(participant);
    setIsModalOpen(true);
  };

  // Function to approve the selected participant (you can implement the approval logic here)
  const handleApproveParticipant = () => {
    // Add your approval logic here
    console.log("Participant approved:", selectedParticipant);
    // Close the modal after approval
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 mt-6 pt-6 text-center">
        Participants Waiting for Approval
      </h2>
      <ul>
        {dummyParticipants.map((participant) => (
          <li
            key={participant.id}
            className="flex justify-between items-center py-2 border-b border-gray-300"
          >
            <span>{participant.name}</span>
            <button
              onClick={() => handleViewParticipant(participant)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
            >
              View
            </button>
          </li>
        ))}
      </ul>

      {/* Participant Details Modal */}
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
            <p>Name: {selectedParticipant.name}</p>
            <p>Email: {selectedParticipant.email}</p>
            <p>Organization: {selectedParticipant.organization}</p>
            <p>Phone Number: {selectedParticipant.phoneNumber}</p>
            {/* Add other participant fields */}
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleApproveParticipant}
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
