import { useEffect, useState } from "react";
import Web3 from "web3";
import { useRouter } from "next/router";
import Layout from "./../../components/Layout";
import convertEpochToHumanReadableString, {
  ExpireInfo,
  getEllipsisTxt,
} from "./../../utils";
import { Check } from "../../components/Check";
import { Copy } from "../../components/Copy";
import { BiddingDialog } from "../../components/BiddingDialog";
import store from "../../Store";
import { useSnapshot } from "valtio";
import { useWallet } from "use-wallet";
import { getContract, getWeb3 } from "../../lib/blockchainService";
import clsx from "clsx";
import { useSpinner } from "../../components/SpinnerContext";

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
  const wallet = useWallet();
  //const snapshot = useSnapshot(store);
  const { showSpinner, hideSpinner } = useSpinner();
  const [contract, setContract] = useState<any>(null);
  const [product, setProduct] = useState<Product>();
  const [currentOwner, setCurrentOwner] = useState();
  const [bidAmount, setBidAmount] = useState<string>("");
  const [expiringIn, setExpiringIn] = useState<ExpireInfo>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [balance, setBalance] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (!contract) {
      setContractInstance();
    }
  }, [contract]);

  async function setContractInstance() {
    setContract(await getContract());
  }

  useEffect(() => {
    if (!router.isReady) return;
    if (!contract) return;

    const { id } = router.query;

    fetchProduct(id!).then(async (product) => {
      await setProductOwner(product.id);
      await setAccountBalance();
    });
  }, [router.isReady, contract, wallet]);

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
    const productOwner = await contract!.methods
      .getProductOwner(productId)
      .call();
    setCurrentOwner(productOwner);
  }

  const showClaimButton = () => {
    return !product?.isSold && currentOwner == wallet.account;
  };
  const isOwnedByAccount = () => {
    return product?.isSold && currentOwner == wallet.account;
  };

  const isAuctionEnded = () => {
    return expiringIn.ended;
  };

  async function claimProduct() {
    showSpinner();
    await contract!.methods
      .claimProduct(product!.id)
      .send({
        from: wallet.account,
      })
      .then(() => {
        hideSpinner();
      })
      .catch(() => {
        hideSpinner();
      });
  }

  async function setAccountBalance() {
    setBalance(
      Number(Number(Web3.utils.fromWei(wallet.balance, "ether")).toFixed(2))
    );
  }

  async function fetchProduct(productId: string | string[]): Promise<Product> {
    showSpinner();

    const product = await contract!.methods.getProduct(productId).call();
    setProduct(product);
    const priceEth = Web3.utils.fromWei(product.price, "ether");
    setBidAmount(String(parseFloat(priceEth) + 0.01));

    return new Promise<Product>((resolve) => {
      resolve(product);
      hideSpinner();
    });
  }

  async function placeBid(bidAmount: string) {
    showSpinner();

    if (bidAmount <= product!.price) {
      hideSpinner();
      alert("Bid amount must be greater than min bid amount");
      return;
    }

    contract!.methods
      .bid(product!.id)
      .send({
        from: wallet.account,
        value: Web3.utils.toWei(bidAmount, "ether"),
      })
      .then((res: any) => {
        if (res) {
          setOpen(!res.status);
          hideSpinner();
        }
      })
      .catch(() => {
        hideSpinner();
      });
  }

  function renderCountdown() {
    let daysValue: any = { "--value": expiringIn.days };
    let hoursValue: any = { "--value": expiringIn.hours };
    let minutesValue: any = { "--value": expiringIn.minutes };
    let secondsValue: any = { "--value": expiringIn.seconds };

    return (
      <div className="grid grid-flow-col gap-5 mt-2 place-items-end auto-cols-max">
        <div>
          <span className="font-mono text-4xl countdown">
            <span style={daysValue}></span>
          </span>
          days
        </div>
        <div>
          <span className="font-mono text-4xl countdown">
            <span style={hoursValue}></span>
          </span>
          hours
        </div>
        <div>
          <span className="font-mono text-4xl countdown">
            <span style={minutesValue}></span>
          </span>
          min
        </div>
        <div>
          <span className="font-mono text-4xl countdown">
            <span style={secondsValue}></span>
          </span>
          sec
        </div>
      </div>
    );
  }

  function renderProduct(product: Product) {
    const priceEth = Web3.utils.fromWei(product.price, "ether");
    const minBidAmount = String(Number(priceEth) + 0.01);

    return (
      <div className="text-white bg-gray-900 ">
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
              <h2 className="text-5xl">
                {product.name}{" "}
                {isOwnedByAccount() && (
                  <span className="self-center justify-center badge badge-secondary badge-outline">
                    You own it!
                  </span>
                )}
              </h2>
              <p className="mt-10 leading-loose">{product.description}</p>

              <div className="flex justify-between mt-10 ">
                <div className="flex flex-col ">
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
              </div>
              <div className="flex-1"></div>
              <div className="flex flex-col ">
                <label className="pb-2 font-medium text-gray-500 text-md">
                  Minimum bid
                </label>
                <p className="font-semibold text-white">{priceEth} ETH</p>
              </div>
              <div className="flex-1"></div>
              <div>
                <label className="pb-2 font-medium text-gray-500 text-md">
                  Available until
                </label>
                {renderCountdown()}
              </div>
              <div className="flex-1"></div>
              <div className="flex justify-around pb-12">
                <button
                  className={clsx("rounded-full btn btn-primary mx-2", {
                    "btn-block ": !showClaimButton(),
                    "w-full flex-auto": showClaimButton(),
                  })}
                  disabled={isAuctionEnded()}
                  onClick={() => setOpen(true)}
                >
                  {isAuctionEnded() ? "Sold" : "Bid"}
                </button>

                {showClaimButton() && (
                  <button
                    className="flex-auto w-full mx-2 rounded-full btn btn-secondary"
                    onClick={() => claimProduct()}
                  >
                    Claim your product
                  </button>
                )}
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
      <div>{product && renderProduct(product)}</div>
    </Layout>
  );
};

export default ProductDetail;
