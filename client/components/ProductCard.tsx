import React from "react";
import Web3 from "web3";
import Link from "next/link";
import { Product } from "./Store";
import { isAuctionEnded } from "../utils";
import clsx from "clsx";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const priceEth = Web3.utils.fromWei(product.price, "ether");

  return (
    <div className="w-full max-w-md p-8 bg-gray-900 border border-gray-800 shadow sm:rounded-2xl">
      <div className="flex flex-col ">
        <div className="">
          <div className="relative w-full mb-3 h-62">
            <div className="absolute top-0 right-0 flex flex-col p-3">
              <button className="w-8 h-8 p-1 text-center text-gray-500 transition duration-300 ease-in bg-gray-800 rounded-full shadow hover:text-purple-500 hover:shadow-md">
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
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
            <Link href={`/products/${product.id}`}>
              <img
                src={product.imageLink}
                alt="Product Image"
                className="object-fill w-full transition duration-500 ease-in-out transform cursor-pointer rounded-2xl hover:scale-105"
              />
            </Link>
          </div>
          <div className="flex-auto justify-evenly">
            <div className="flex flex-wrap ">
              <div className="flex items-center justify-between w-full min-w-0 ">
                <h2 className="mr-auto text-lg text-gray-200 truncate cursor-pointer hover:text-purple-500 ">
                  {product.name}
                </h2>
                <div
                  className={clsx(
                    {
                      "flex items-center px-2 py-1 ml-3 text-sm text-white  rounded-lg":
                        true,
                    },
                    { "bg-green-500": !isAuctionEnded(product.expireTime) },
                    { "bg-red-500": isAuctionEnded(product.expireTime) }
                  )}
                >
                  {isAuctionEnded(product.expireTime) ? "ENDED" : "SELLING"}
                </div>
              </div>
            </div>
            <div className="mt-2 text-xl font-semibold text-white">
              {priceEth} ETH
            </div>
            <div className="py-2 text-sm text-gray-600 lg:flex"></div>
            <div className="flex justify-center space-x-2 text-sm font-medium">
              <Link href={`/products/${product.id}`}>
                <button className="inline-flex items-center px-5 py-2 mb-2 font-medium tracking-wider text-white transition duration-150 ease-in rounded-full bg-primary md:mb-0 hover:shadow-lg hover:bg-secondary ">
                  <span>View Details</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
