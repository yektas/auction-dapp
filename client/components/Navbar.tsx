import React from "react";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { getEllipsisTxt } from "../utils";

const Navbar = () => {
  const { account, deactivate } = useWeb3React();

  let address = "-";
  if (account) {
    address = getEllipsisTxt(account);
  }

  const disconnect = () => {
    localStorage.setItem("connected", "2");
    deactivate();
  };

  return (
    <>
      <div className="bg-gray-800 shadow-lg navbar text-neutral-content">
        <Link href="/">
          <div className="flex-none px-2 mx-2 cursor-pointer">
            <span className="text-lg font-bold">AuctionUI</span>
          </div>
        </Link>

        <div className="flex-1 px-2 mx-2"></div>
        <div className="flex-none"></div>
        {account && (
          <div>
            <div className="dropdown dropdown-end dropdown-hover">
              <div className="lowercase btn">
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
                <span className="text-indigo-500">{address}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
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
              </div>
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
      <div className="pb-2 bg-gray-800 border-t-2 border-gray-700"></div>
    </>
  );
};

export default Navbar;
