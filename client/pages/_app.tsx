import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { AuthContextProvider } from "../context/AuthContext";
import "../styles/globals.css";
import { FirestoreProvider, ContractProvider } from "../providers";

const activeChain = "mumbai";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      activeChain={activeChain}
    >
      <AuthContextProvider>
        <FirestoreProvider>
          <ContractProvider>
            <Component {...pageProps} />
          </ContractProvider>
        </FirestoreProvider>
      </AuthContextProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
