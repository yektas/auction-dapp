import { useEffect, useState } from "react";
import getContract from "../lib/getContract";
import getWeb3 from "../lib/getWeb3";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";

type Product = {
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

  function renderProduct(product: Product) {
    const priceEth = Web3.utils.fromWei(product.price, "ether");

    return (
      <div className="text-center shadow-2xl bg-base-100 card">
        <figure className="px-10 pt-10">
          <img src={product.imageLink} className="rounded-xl" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{product.name}</h2>
          <p>{product.description}</p>
          <p>{product.id}</p>
          <p>{product.expireTime}</p>
          <p>{product.isSold}</p>
          <p>
            <img className="inline w-5 h-5 mx-1" src="/eth-logo.svg" />
            {priceEth} ETH
          </p>
          <div className="justify-center card-actions">
            <Link href={`/products/${product.id}`}>
              <button className="btn btn-primary modal-button">Bid</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function isOwner() {
    return owner == account;
  }

  return (
    <>
      {isOwner() && (
        <button
          className="float-right btn btn-primary"
          onClick={() => addNewProduct()}
        >
          ADD NEW PRODUCT
        </button>
      )}
      <h1 className="prose-2xl ">PRODUCTS</h1>
      <div className="grid grid-cols-3 gap-6">
        {products.map((product: Product) => renderProduct(product))}
      </div>
    </>
  );
};

export default Store;
