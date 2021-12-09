import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UseWalletProvider } from "use-wallet";
import MetamaskProvider from "../MetamaskProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UseWalletProvider
      connectors={{
        injected: {
          //allows you to connect and switch between mainnet and rinkeby within Metamask.
          chainId: [1, 3, 4, 5, 42, 1337],
        },
        // walletconnect: {
        //   chainId: [1],
        //   rpcUrl: "https://mainnet.eth.aragon.network/",
        // },
      }}
    >
      <MetamaskProvider>
        <Component {...pageProps} />
      </MetamaskProvider>
    </UseWalletProvider>
  );
}

export default MyApp;
