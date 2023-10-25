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
  sellerInfo: any;
}

export const SellerInfoModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  sellerInfo,
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
      {sellerInfo && (
        <div>
          <p>Name: {sellerInfo.name}</p>
          <p>Email: {sellerInfo.email}</p>
          <p>Organization: {sellerInfo.organization}</p>
          <p>Phone Number: {sellerInfo.phoneNumber}</p>
        </div>
      )}
    </Modal>
  );
};
