import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { isAuctionEnded } from "../utils";
import { getContract } from "../lib/blockchainService";
import { useSpinner } from "./SpinnerContext";
export type Product = {
  name: string;
  description: string;
  imageLink: string;
  id: number;
  price: string;
  expireTime: number;
  isSold: boolean;
};
import { subscribe } from "valtio";
import store from "../Store";

type Props = {};

const StorePage = ({}: Props) => {
  const { showSpinner, hideSpinner } = useSpinner();

  const [contract, setContract] = useState<any>(null);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [endedProducts, setEndedProducts] = useState<Product[]>([]);
  const [owner, setOwner] = useState();
  const [bidAmount, setBidAmount] = useState<number>();

  useEffect(() => {
    showSpinner();
    if (!contract) {
      setContractInstance();
    }

    if (contract) {
      contract.events
        .ProductCreated({})
        .on("data", (event: any) => fetchProducts());

      fetchProducts();
      setContractOwner();
      hideSpinner();
    }
  }, [contract]);

  async function setContractInstance() {
    setContract(await getContract());
  }

  async function setContractOwner() {
    setOwner(await contract!.methods.owner().call());
  }

  async function fetchProducts() {
    if (contract == null) {
      return;
    }
    const products = await contract!.methods.getProducts().call();

    let liveProducts: Product[] = [];
    let endedProducts: Product[] = [];
    products.forEach((product: Product) => {
      if (isAuctionEnded(product.expireTime)) {
        endedProducts.push(product);
      } else {
        liveProducts.push(product);
      }
    });
    setLiveProducts(liveProducts);
    setEndedProducts(endedProducts);
  }

  return (
    <>
      <div className="py-16 hero h-1/2">
        <div className="container px-4 mx-auto sm:px-8 lg:px-16 xl:px-20">
          <div className="grid items-center grid-cols-1 gap-8 hero-wrapper md:grid-cols-12">
            <div className="col-span-6 hero-text">
              <h1 className="max-w-xl text-4xl font-bold leading-tight text-white md:text-5xl">
                Best products are here!
              </h1>

              <hr className="w-1/3 h-1 mt-8 bg-orange-500 border-orange-500 rounded-full " />
              <p className="mt-8 text-base font-semibold leading-relaxed text-white ">
                You can find your favorite products with a really good prices
              </p>
              <div className="flex justify-center mt-10 space-x-5 get-app md:justify-start">
                <button className="btn btn-primary">Shop Now</button>
              </div>
            </div>

            <div className="max-w-lg col-span-6">
              <img src="/deliveries.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className="pb-2 bg-gray-900 border-t-2 border-gray-700"></div>

      <div className="container mx-auto mt-10 space-y-10">
        <h1 className="text-3xl prose-2xl text-white">Live Auctions</h1>
        <div className="pb-2 bg-gray-900 border-t-2 border-gray-700"></div>
        <div className="grid grid-cols-3 gap-10 ">
          {liveProducts &&
            liveProducts.map((product: Product) => (
              <ProductCard product={product} />
            ))}
        </div>
        <h1 className="my-5 text-3xl prose-2xl text-white">Ended Auctions</h1>
        <div className="pb-2 bg-gray-900 border-t-2 border-gray-700"></div>
        <div className="grid grid-cols-3 gap-10 ">
          {endedProducts &&
            endedProducts.map((product: Product) => (
              <ProductCard product={product} />
            ))}
        </div>
      </div>
    </>
  );
};

export default StorePage;
