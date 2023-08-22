import Modal from "react-modal";

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

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (arg0: boolean) => void;
  selectedParticipant: any;
  handleApproveParticipant: any;
}

export const AdminModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  selectedParticipant,
  handleApproveParticipant,
}) => {
  return (
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
  );
};
