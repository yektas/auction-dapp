import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import WalletSvg from "../public/wallet.svg";
import MetamaskFox from "../public/metamask-fox.svg";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import getWeb3 from "../lib/getWeb3";
import getContract from "../lib/getContract";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import getDollarsValue from "../lib/getDollarsValue";
import { AxiosResponse } from "axios";
import SelectWallet from "../components/SelectWallet";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { injected, walletConnect } from "../components/wallet/connectors";
import Navbar from "./../components/Navbar";
import {
  useEagerConnect,
  useInactiveListener,
} from "./../components/wallet/hooks";
import Layout from "../components/Layout";
import Link from "next/link";
import Store from "../components/Store";

export enum ConnectorNames {
  Metamask = "Metamask",
  WalletConnect = "WalletConnect",
}

const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Metamask]: injected,
  [ConnectorNames.WalletConnect]: walletConnect,
};

const Home: NextPage = () => {
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = useWeb3React<Web3Provider>();

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState<any>();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  useEffect(() => {
    /* getDollarsValue().then((res) => {
      setDollarValue(res.data.rates["ETH"]);
    }); */
    //getData();
  }, []);

  const onConnectWallet = async (name: ConnectorNames) => {
    setActivatingConnector(currentConnector);
    activate(connectorsByName[name]);
    localStorage.setItem("connected", "1");
  };

  const currentConnector = injected;
  const activating = currentConnector === activatingConnector;
  const connected = currentConnector === connector;
  const disabled = !triedEager || !!activatingConnector || connected || !!error;

  return (
    <Layout>
      {!account ? (
        <div className="container flex flex-col items-center justify-center px-6 py-16 mx-auto md:px-12 xl:py-24">
          <h1 className="mb-4 text-5xl font-extrabold leading-tight text-center text-gray-800 sm:text-6xl">
            Welcome to Auction
          </h1>
          <div className="w-2/5 h-screen m-auto mt-4">
            <SelectWallet
              activatingConnector={currentConnector}
              activating={activating}
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
