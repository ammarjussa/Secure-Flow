import { ConnectWallet } from "@thirdweb-dev/react";

interface Props {
  page?: string;
}

const Header: React.FC<Props> = ({ page }) => {
  return (
    <header className="bg-white text-blue-500 py-3 flex items-center justify-around">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold">SecureFlow</h1>
      </div>
      {page === "dashboard" ? (
        <ConnectWallet
          theme="light"
          style={{ marginRight: "30px" }}
          dropdownPosition={{
            side: "bottom",
            align: "center",
          }}
        />
      ) : null}
    </header>
  );
};

export default Header;
