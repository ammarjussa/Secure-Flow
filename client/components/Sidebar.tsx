interface Props {
  user: any;
}

const Sidebar: React.FC<Props> = ({ user }) => {
  const trimAddress = (address: string) => {
    return address?.slice(0, 5) + "...." + address?.slice(-5);
  };
  return (
    <div className="flex overflow-hidden">
      <div className="flex flex-col items-center justify-between h-[calc(100vh-190px)] w-64  py-8 px-4">
        <div className="flex flex-col items-center">
          <img
            src="/ammar.jpg"
            alt="Profile Picture"
            className="rounded-full h-20 w-20 mb-2"
          />
          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-sm ">{user?.role}</p>
        </div>
        <div>
          <div className="mt-8">
            <p className="text-sm ">
              <b>Wallet Address: </b> {trimAddress(user?.walletAddress)}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm">
              <b>Organization: </b>
              {user?.organization}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm">
              <b>City: </b>
              {user?.city}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm">
              <b>Country </b>
              {user?.country}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-sm">
              <b>Email </b>
              {user?.email}
            </p>
          </div>
        </div>
        <div className="relative text-center">
          <button className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-3xl focus:outline-none focus:shadow-outline">
            Change details
          </button>
        </div>
      </div>
      <div className="inline-block h-[calc(100vh-185px)] min-h-[1em] w-0.5 self-stretch bg-neutral-200 opacity-100 dark:opacity-50"></div>
    </div>
  );
};

export default Sidebar;
