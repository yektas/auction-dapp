import { useEffect } from "react";
import type { NextPage } from "next";
import SelectWallet from "../components/SelectWallet";
import Layout from "../components/Layout";
import StorePage from "../components/StorePage";
import { useWallet } from "use-wallet";

export type ConnectionInfo = {
  connector: "injected" | "walletconnect";
  connected: boolean;
};

export enum ConnectorNames {
  Metamask = "Metamask",
  WalletConnect = "WalletConnect",
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Metamask]: "injected",
  [ConnectorNames.WalletConnect]: "walletconnect",
};

const Index: NextPage = () => {
  const wallet = useWallet();
  const activate = (connector: any) => wallet.connect(connector);

  const onConnectWallet = async (name: ConnectorNames) => {
    activate(connectorsByName[name]).finally(() => {
      const connectionInfo: ConnectionInfo = {
        connector: connectorsByName[name],
        connected: true,
      };
      localStorage.setItem("ConnectionInfo", JSON.stringify(connectionInfo));
    });
  };

  return (
    <Layout>
      {!wallet.isConnected() ? (
        <div className="container flex flex-col items-center justify-center px-6 py-16 mx-auto md:px-12 xl:py-24">
          <h1 className="mb-4 text-5xl font-extrabold leading-tight text-center text-white sm:text-6xl">
            Welcome to Auction
          </h1>
          <div className="w-2/5 h-screen m-auto mt-4">
            <SelectWallet onClick={onConnectWallet} />
          </div>
        </div>
      ) : (
        <StorePage />
      )}
    </Layout>
  );
};

export default Index;
