import Web3 from "web3";
import { AbiItem } from "web3-utils";
import contractJson from "../../build/contracts/Auction.json";

let web3Instance: Web3;

const CONTRACT_ADRESS = "0x701F8f09FD8Ab9c585afFC269726a53Ad57aE61B";

const check = async (): Promise<Web3> => {
  const w = window as unknown as Window & { ethereum: any; web3: Web3 };

  if (w.ethereum) {
    const web3 = new Web3(w.ethereum);
    try {
      // ask user permission to access his accounts
      await w.ethereum.request({ method: "eth_requestAccounts" });
      web3Instance = web3;
      return web3;
    } catch (error) {
      throw Error("error");
    }
  } else {
    console.log("Must install MetaMask");
  }

  throw Error("web3 not found");
};

const setWeb3 = () => {
  return new Promise<Web3 | undefined>((resolve, reject) => {
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === "complete") {
      return check().then(resolve).catch(reject);
    }

    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      check().then(resolve).catch(reject);
    });
  });
};

let getWeb3Instance = async function () {
  if (!web3Instance) {
    await setWeb3();
  }
  return web3Instance;
};

let getContract = function () {
  return new Promise<any>(async (resolve) => {
    if (!web3Instance) {
      await setWeb3();
    }
    resolve(
      new web3Instance!.eth.Contract(
        contractJson.abi as AbiItem[],
        process.env.NEXT_PUBLIC_AUCTION_ADDRESS || CONTRACT_ADRESS
      )
    );
  });
};

export { setWeb3, getWeb3Instance as getWeb3, getContract };
