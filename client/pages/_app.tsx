import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UseWalletProvider } from "use-wallet";
import MetamaskProvider from "../MetamaskProvider";
import { SpinnerProvider } from "../components/SpinnerContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UseWalletProvider
      connectors={{
        injected: {
          //allows you to connect and switch between mainnet and rinkeby within Metamask.
          chainId: [1, 3, 4, 5, 42, 1337],
        },
        walletconnect: {
          rpc: { 5777: "http://192.168.1.99:7545" },
        },
      }}
    >
      <MetamaskProvider>
        <SpinnerProvider>
          <Component {...pageProps} />
        </SpinnerProvider>
      </MetamaskProvider>
    </UseWalletProvider>
  );
}

export default MyApp;
