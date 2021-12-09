import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getEllipsisTxt } from "../utils";
import { NewProductDialog } from "./NewProductDialog";
import { useWallet } from "use-wallet";
import { getContract } from "../lib/blockchainService";
import { useRouter } from "next/router";
type Props = {};

const Navbar = (props: Props) => {
  const router = useRouter();
  const wallet = useWallet();
  const [isOwner, setIsOwner] = useState(false);
  const [open, setOpen] = useState(false);

  let address = "-";
  if (wallet.account) {
    address = getEllipsisTxt(wallet.account);
  }

  useEffect(() => {
    setContractOwner();
  }, [wallet.account]);

  async function setContractOwner() {
    const contract = await getContract();
    const owner = await contract.methods.owner().call();
    setIsOwner(owner == wallet.account);
  }

  const disconnect = () => {
    wallet.reset();
    localStorage.removeItem("ConnectionInfo");
    router.push("/");
  };

  function onNewProduct() {
    setOpen(true);
  }

  return (
    <>
      <div className="bg-gray-900 shadow-lg navbar text-neutral-content">
        <Link href="/">
          <div className="flex-none px-2 mx-2 cursor-pointer">
            <span className="text-lg font-bold">AuctionUI</span>
          </div>
        </Link>

        <div className="flex-1 px-2 mx-2"></div>
        {isOwner && (
          <>
            <a onClick={onNewProduct} className="bg-primary btn ">
              Create New Product
            </a>
            <NewProductDialog open={open} onClose={() => setOpen(false)} />
          </>
        )}
        <div className="flex-none"></div>
        {wallet.isConnected() && (
          <div>
            <div className="dropdown dropdown-end dropdown-hover">
              <button className="btn btn-ghost rounded-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="text-white lowercase">{address}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <ul className="shadow menu dropdown-content rounded-box w-52">
                <li>
                  <button className="btn" onClick={() => disconnect()}>
                    Disconnect
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="pb-2 bg-gray-900 border-t-2 border-gray-700"></div>
    </>
  );
};

export default Navbar;
