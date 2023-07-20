"use client";

import Web3 from "web3";
import { useState } from "react";
import ConnectWalletButton from "./ConnectWallet";

interface Props {
  page?: string;
}

const Header: React.FC<Props> = ({ page }) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  console.log(address);

  const onPressConnect = async () => {
    setLoading(true);

    try {
      if ((window as any)?.ethereum && (window as any)?.ethereum?.isMetaMask) {
        // Desktop browser
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        });

        const account = Web3.utils.toChecksumAddress(accounts[0]);
        setAddress(account);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const onPressLogout = () => setAddress("");

  return (
    <header className="bg-white text-blue-500 py-3 flex items-center justify-between">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold">SecureFlow</h1>
      </div>
      {page === "dashboard" ? (
        <ConnectWalletButton
          onPressConnect={onPressConnect}
          onPressLogout={onPressLogout}
          loading={loading}
          address={address}
        />
      ) : null}
    </header>
  );
};

export default Header;
