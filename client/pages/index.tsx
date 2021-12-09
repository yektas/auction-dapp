import { useEffect } from "react";
import type { NextPage } from "next";
import SelectWallet from "../components/SelectWallet";
import store from "../Store";
import { useSnapshot } from "valtio";
import Layout from "../components/Layout";
import Store from "../components/Store";
import { useWallet } from "use-wallet";

export enum ConnectorNames {
  Metamask = "Metamask",
  WalletConnect = "WalletConnect",
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Metamask]: "injected",
  [ConnectorNames.WalletConnect]: "frame",
};

const Home: NextPage = () => {
  const wallet = useWallet();
  const activate = (connector: any) => wallet.connect(connector);

  useEffect(() => {
    /* getDollarsValue().then((res) => {
      setDollarValue(res.data.rates["ETH"]);
    }); */
    //getData();
  }, []);

  const onConnectWallet = async (name: ConnectorNames) => {
    activate(connectorsByName[name]);
    localStorage.setItem("connected", "1");
  };

  return (
    <Layout>
      {!wallet.isConnected() ? (
        <div className="container flex flex-col items-center justify-center px-6 py-16 mx-auto md:px-12 xl:py-24">
          <h1 className="mb-4 text-5xl font-extrabold leading-tight text-center text-gray-800 sm:text-6xl">
            Welcome to Auction
          </h1>
          <div className="w-2/5 h-screen m-auto mt-4">
            <SelectWallet
              activating={wallet.status == "connecting"}
              onClick={onConnectWallet}
            />
          </div>
        </div>
      ) : (
        <Store />
      )}
    </Layout>
  );
};

export default Home;
