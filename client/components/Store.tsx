import { useEffect, useState } from "react";
import getContract from "../lib/getContract";
import getWeb3 from "../lib/getWeb3";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { useWeb3React } from "@web3-react/core";
import ProductCard from "./ProductCard";

export type Product = {
  name: string;
  description: string;
  imageLink: string;
  id: number;
  price: string;
  expireTime: number;
  isSold: boolean;
};

type Props = {};
const Store = ({}: Props) => {
  const { account } = useWeb3React();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState();
  const [bidAmount, setBidAmount] = useState<number>();

  useEffect(() => {
    fetchProducts();
    setContractOwner();
  });

  async function setContractOwner() {
    const contract = await getContract();
    setOwner(await contract.methods.owner().call());
  }

  async function fetchProducts() {
    const contract = await getContract();
    const products = await contract.methods.getProducts().call();

    /*     contract!.events.ProductCreated()
          .on('data', async () => console.log("Event called"))
     */
    setProducts(products);
  }

  async function addNewProduct() {
    const contract = await getContract();
    await contract.methods
      .addProduct(
        "Nike Airmax",
        `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/1024/768`,
        "test",
        Web3.utils.toWei("0.01", "ether"),
        5
      )
      .send({
        from: account,
      });
  }

  function isOwner() {
    return owner == account;
  }

  return (
    <>
      <div className="py-16 bg-gray-900 hero">
        <div className="container px-4 mx-auto sm:px-8 lg:px-16 xl:px-20">
          <div className="grid items-center grid-cols-1 gap-8 hero-wrapper md:grid-cols-12">
            <div className="col-span-6 hero-text">
              <h1 className="max-w-xl text-4xl font-bold leading-tight text-white md:text-5xl">
                Best products are here!
              </h1>
              <hr className="w-12 h-1 mt-8 bg-orange-500 rounded-full " />
              <p className="mt-8 text-base font-semibold leading-relaxed text-white ">
                You can find your favorite products with a really good prices
              </p>
              <div className="flex justify-center mt-10 space-x-5 get-app md:justify-start">
                <button className="btn btn-outline btn-primary">
                  Browse Now
                </button>
              </div>
            </div>

            <div className="col-span-6 hero-image">
              <img src="/deliveries.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>

      {/*       {isOwner() && (
        <button
          className="float-right btn btn-primary"
          onClick={() => addNewProduct()}
        >
          ADD NEW PRODUCT
        </button>
      )} */}
      <div className="container mx-auto mt-10 space-y-10">
        <h1 className="text-3xl prose-2xl text-white">Live Auctions</h1>
        <div className="divider"></div>
        <div className="grid grid-cols-3 gap-10 ">
          {products.map((product: Product) => (
            <ProductCard product={product} />
          ))}
        </div>
        <h1 className="my-5 text-3xl prose-2xl text-white">Ended Auctions</h1>
        <div className="divider"></div>
        <div className="grid grid-cols-3 gap-10 ">
          {products.map((product: Product) => (
            <ProductCard product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Store;
