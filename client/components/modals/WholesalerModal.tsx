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
  order: any;
  currentProduct: any;
  handleChange: any;
  call: any;
}

export const WholesalerModal: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  order,
  currentProduct,
  handleChange,
  call,
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      style={modalStyles}
      contentLabel="Add Product"
      ariaHideApp={false}
    >
      <h2 className="text-2xl font-bold mb-4">Order Product</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="seller" className="block font-medium mb-2">
            Seller Address
          </label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            type="text"
            id="seller"
            name="seller"
            value={order.seller}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block font-medium mb-2">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={order.quantity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={(e: any) => call(e, order, currentProduct as any)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
          >
            Approve
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors duration-300 ml-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
