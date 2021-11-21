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
import { WalletContext } from "../WalletContext";
import Layout from "../components/Layout";
import Link from "next/link";
const auctionContractAddress = "0x4064419a762835A7949341071176dB9CDF08B614";

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

  const [imageLink, setImageLink] = useState();
  const [description, setDescription] = useState();
  const [highestBid, setHighestBid] = useState(0);
  const [contract, setContract] = useState<Contract>();
  const [accounts, setAccounts] = useState<string[]>();

  const [defaultAccount, setDefaultAccount] = useState<string>();
  const [dollarValue, setDollarValue] = useState<number>();
  const [web3, setWeb3] = useState<Web3>();
  useEffect(() => {
    /* getDollarsValue().then((res) => {
      setDollarValue(res.data.rates["ETH"]);
    }); */
    //getData();
  }, []);

  const [wallet, setWallet] = useContext(WalletContext);

  const getData = async () => {
    const web3 = await getWeb3();
    if (!web3) {
      return;
    }
    const contract = await getContract(web3, auctionContractAddress);
    const image = await contract.methods.imageLink().call();
    const description = await contract.methods.description().call();
    const highestBid = await contract.methods.highestBid().call();
    setWeb3(web3);
    setContract(contract);
    setImageLink(image);
    setDescription(description);
    setHighestBid(highestBid);
  };

  const onBid = async () => {
    let dogeImage =
      "https://www.coinkolik.com/wp-content/uploads/2021/01/dogecoin-yuzde-860-yukseldi.png";
    let description = "Doge is much cooler though";
    let newBid = highestBid + 1;
    await contract?.methods.bid(dogeImage, description).send({
      from: "",
      gas: 1000000,
      value: newBid,
    });
    await getData();
  };

  const onConnectWallet = async (name: ConnectorNames) => {
    setActivatingConnector(currentConnector);
    activate(connectorsByName[name]);
    setWallet(account);
  };

  const currentConnector = injected;
  const activating = currentConnector === activatingConnector;
  const connected = currentConnector === connector;
  const disabled = !triedEager || !!activatingConnector || connected || !!error;

  return (
    <Layout>
      <div className="container relative z-10 flex items-center px-6 py-32 mx-auto md:px-12 xl:py-40">
        <div className="relative z-10 flex flex-col items-center w-full">
          <h1 className="mb-4 font-extrabold leading-tight text-center text-gray-800 text-7xl sm:text-8xl">
            Welcome to Auction
          </h1>
          {!account ? (
            <div className="w-2/5 m-auto mt-4 ">
              <SelectWallet
                activatingConnector={currentConnector}
                activating={activating}
                onClick={onConnectWallet}
              />
            </div>
          ) : null}
        </div>
      </div>
      {connected && <Link href="/auction">Go to auction</Link>}
    </Layout>
  );
};

export default Home;
