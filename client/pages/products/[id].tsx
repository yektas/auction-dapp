import { useEffect, useState, Fragment } from "react";
import getContract from "../../lib/getContract";
import getWeb3 from "../../lib/getWeb3";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import Layout from "./../../components/Layout";
import { Dialog, Transition } from "@headlessui/react";
import convertEpochToHumanReadableString, {
  getEllipsisTxt,
  isAuctionEnded,
} from "./../../utils";
import { Check } from "../../components/Check";
import { Copy } from "../../components/Copy";
import { BiddingDialog } from "../../components/BiddingDialog";

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

const ProductDetail = ({}: Props) => {
  const { library, account } = useWeb3React();

  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(false);
  const [currentOwner, setCurrentOwner] = useState();
  const [bidAmount, setBidAmount] = useState<string>("");
  const [expiringIn, setExpiringIn] = useState<string>("-");
  const [balance, setBalance] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const { id } = router.query;

    fetchProduct(id!).then(async (product) => {
      await setProductOwner(product.id);
      await setAccountBalance();
    });
  }, [router.isReady]);

  useEffect(() => {
    if (!product) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setExpiringIn(convertEpochToHumanReadableString(product.expireTime));
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [product, expiringIn]);

  async function setProductOwner(productId: number) {
    const contract = await getContract();

    const productOwner = await contract.methods
      .getProductOwner(productId)
      .call();
    console.log("Product owner ", productOwner);
    setCurrentOwner(productOwner);
  }

  async function setAccountBalance() {
    const balance = await library.eth.getBalance(account);
    setBalance(Number(Number(Web3.utils.fromWei(balance, "ether")).toFixed(2)));
  }

  async function fetchProduct(productId: string | string[]): Promise<Product> {
    const contract = await getContract();
    const product = await contract.methods.getProduct(productId).call();

    setProduct(product);
    const priceEth = Web3.utils.fromWei(product.price, "ether");
    setBidAmount(String(parseFloat(priceEth) + 0.01));

    return new Promise<Product>((resolve) => {
      resolve(product);
    });
  }

  async function placeBid(bidAmount: string) {
    if (bidAmount <= product!.price) {
    }

    const contract = await getContract();

    const result = await contract.methods
      .bid(product!.id)
      .send({ from: account, value: Web3.utils.toWei(bidAmount, "ether") });
    console.log(result);
  }

  function renderProduct(product: Product) {
    const priceEth = Web3.utils.fromWei(product.price, "ether");
    const minBidAmount = String(Number(priceEth) + 0.01);

    return (
      <div className="text-white bg-gray-800 ">
        <div className="grid grid-cols-3 divide-x-2 divide-gray-700">
          <div className="col-span-2 py-4 place-self-center">
            <figure className="px-10 place-self-center ">
              <img
                src={product.imageLink}
                className="w-full h-full place-self-center"
              />
            </figure>
          </div>

          <div className="h-full pt-4 pr-24">
            <div className="flex flex-col h-full px-10">
              <h2 className="text-5xl">{product.name}</h2>
              <p className="mt-10 leading-loose">{product.description}</p>
              <div className="flex flex-col my-10 ">
                <p className="pb-2 font-medium text-gray-500 text-md ">
                  Highest Bidder
                </p>
                <p className="flex font-semibold text-white ">
                  {currentOwner && getEllipsisTxt(currentOwner)}
                  <span className="inline-block">
                    {isCopied ? (
                      <Check />
                    ) : (
                      <Copy
                        onClick={() => setIsCopied(true)}
                        address={currentOwner!}
                      />
                    )}
                  </span>
                </p>
              </div>
              <div className="flex-1"></div>

              <div className="flex justify-between">
                <div className="flex flex-col ">
                  <label className="font-medium text-gray-500 text-md">
                    Minimum bid
                  </label>
                  <p className="font-semibold text-white">{priceEth} ETH</p>
                </div>
                <div>
                  <label className="font-medium text-gray-500 text-md">
                    Available until
                  </label>
                  <p className="font-semibold text-white">{expiringIn}</p>
                </div>
              </div>
              <div className="flex-1"></div>
              <div className="justify-center pb-12">
                <button
                  className="rounded-full btn btn-primary btn-block "
                  onClick={() => setOpen(true)}
                >
                  Bid
                </button>
              </div>
            </div>

            <BiddingDialog
              open={open}
              onClose={() => setOpen(false)}
              minBidAmount={minBidAmount}
              currentBalance={balance}
              onSubmit={(bidAmount) => placeBid(bidAmount)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="h-screen">{product && renderProduct(product)}</div>
    </Layout>
  );
};

export default ProductDetail;
