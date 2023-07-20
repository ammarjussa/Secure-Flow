interface Props {
  onPressLogout: () => void;
  onPressConnect: () => void;
  loading: boolean;
  address: string;
}

const ConnectWalletButton: React.FC<Props> = ({
  onPressLogout,
  onPressConnect,
  loading,
  address,
}) => {
  return (
    <div>
      {address && !loading ? (
        <button
          onClick={onPressLogout}
          className="bg-blue-500 text-white w-200 py-4 px-6 mr-4 flex items-center justify-content-around text-sm font-bold cursor-pointer rounded-md"
        >
          Disconnect
        </button>
      ) : loading ? (
        <button
          className={
            "bg-blue-500 text-white w-200 py-4 px-6 mr-4 flex items-center justify-content-around text-sm font-bold rounded-md "
          }
          disabled
        >
          <div>Loading...</div>
        </button>
      ) : (
        <button
          onClick={onPressConnect}
          className="bg-blue-500 text-white py-4 px-6 mr-4  flex items-center justify-content-around text-sm font-bold cursor-pointer rounded-md"
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
