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
  producerProducts: any;
  ppLoad: boolean;
  ppErr: any;
  producerOrders: any;
  poLoad: boolean;
  poErr: any;
  producersOrdersDelivered: any;
  podLoad: boolean;
  podErr: any;
  addProduct: any;
  apLoad: boolean;
  markOrderDelivered: any;
  modLoad: boolean;
  wholesaleOrders: any;
  woLoad: boolean;
  woErr: any;
  placeOrder: any;
  pOrderLoad: boolean;
}

const ContractContext = createContext<ContextProps>({
  address: "",
  producerProducts: () => {},
  ppLoad: false,
  ppErr: {},
  producerOrders: () => {},
  poLoad: false,
  poErr: {},
  producersOrdersDelivered: () => {},
  podLoad: false,
  podErr: {},
  addProduct: () => {},
  apLoad: false,
  markOrderDelivered: () => {},
  modLoad: false,
  wholesaleOrders: () => {},
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
    data: producersOrdersDelivered,
    isLoading: podLoad,
    error: podErr,
  } = useContractRead(contract, "getSellerOrdersDataDelivered", [address]);

  const {
    data: producerOrders,
    isLoading: poLoad,
    error: poErr,
  } = useContractRead(contract, "getSellerOrdersData", [address]);

  const {
    data: producerProducts,
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
    data: wholesaleOrders,
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
        producerProducts,
        ppLoad,
        ppErr,
        producerOrders,
        poLoad,
        poErr,
        producersOrdersDelivered,
        podLoad,
        podErr,
        addProduct,
        apLoad,
        markOrderDelivered,
        modLoad,
        wholesaleOrders,
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
