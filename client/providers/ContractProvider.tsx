import { ReactNode, createContext, useContext, useState } from "react";
import {
  useAddress,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import SecureFlowABI from "../SecureFlow.abi.json";

interface Props {
  children: ReactNode;
}

interface ContextProps {
  address: string | undefined;
  moneySpent: any;
  msLoad: boolean;
  msErr: any;
  moneyEarned: any;
  meLoad: boolean;
  meErr: any;
  sellerProducts: any;
  ppLoad: boolean;
  ppErr: any;
  sellerOrders: any;
  poLoad: boolean;
  poErr: any;
  sellerOrdersDelivered: any;
  podLoad: boolean;
  podErr: any;
  addProduct: any;
  apLoad: boolean;
  markOrderDelivered: any;
  modLoad: boolean;
  buyerOrders: any;
  woLoad: boolean;
  woErr: any;
  placeOrder: any;
  pOrderLoad: boolean;
}

const ContractContext = createContext<ContextProps>({
  address: "",
  moneySpent: 0,
  msLoad: false,
  msErr: {},
  moneyEarned: 0,
  meLoad: false,
  meErr: {},
  sellerProducts: () => {},
  ppLoad: false,
  ppErr: {},
  sellerOrders: () => {},
  poLoad: false,
  poErr: {},
  sellerOrdersDelivered: () => {},
  podLoad: false,
  podErr: {},
  addProduct: () => {},
  apLoad: false,
  markOrderDelivered: () => {},
  modLoad: false,
  buyerOrders: () => {},
  woLoad: false,
  woErr: {},
  placeOrder: () => {},
  pOrderLoad: false,
});

export const ContractProvider: React.FC<Props> = ({ children }) => {
  const address = useAddress();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    SecureFlowABI
  );

  const {
    data: moneySpent,
    isLoading: msLoad,
    error: msErr,
  } = useContractRead(contract, "getMoneySpent", [address]);

  const {
    data: moneyEarned,
    isLoading: meLoad,
    error: meErr,
  } = useContractRead(contract, "getMoneyEarned", [address]);

  // PRODUCER
  const {
    data: sellerOrdersDelivered,
    isLoading: podLoad,
    error: podErr,
  } = useContractRead(contract, "getSellerOrdersDataDelivered", [address]);

  const {
    data: sellerOrders,
    isLoading: poLoad,
    error: poErr,
  } = useContractRead(contract, "getSellerOrdersData", [address]);

  const {
    data: sellerProducts,
    isLoading: ppLoad,
    error: ppErr,
  } = useContractRead(contract, "getProductsData", [address]);

  const { mutateAsync: addProduct, isLoading: apLoad } = useContractWrite(
    contract,
    "addProduct"
  );

  const { mutateAsync: markOrderDelivered, isLoading: modLoad } =
    useContractWrite(contract, "markOrderDelivered");

  // WHOLESALERS CONTRACT

  const {
    data: buyerOrders,
    isLoading: woLoad,
    error: woErr,
  } = useContractRead(contract, "getBuyerOrdersData", [address]);

  const { mutateAsync: placeOrder, isLoading: pOrderLoad } = useContractWrite(
    contract,
    "placeOrder"
  );

  // RETAILER CONTRACTS

  // CONSUMER CONTRACTS

  return (
    <ContractContext.Provider
      value={{
        address,
        moneySpent,
        msLoad,
        msErr,
        moneyEarned,
        meLoad,
        meErr,
        sellerProducts,
        ppLoad,
        ppErr,
        sellerOrders,
        poLoad,
        poErr,
        sellerOrdersDelivered,
        podLoad,
        podErr,
        addProduct,
        apLoad,
        markOrderDelivered,
        modLoad,
        buyerOrders,
        woLoad,
        woErr,
        placeOrder,
        pOrderLoad,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export function useContractContext(): ContextProps {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error(
      "useFirestoreContext must be used within Firestore Provider"
    );
  }
  return context;
}
