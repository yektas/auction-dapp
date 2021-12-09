import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface Props {
  open: boolean;
  onClose: () => void;
  minBidAmount: string;
  currentBalance: number;
  onSubmit: (bidAmount: string) => void;
}

export const BiddingDialog = ({
  open,
  onClose,
  minBidAmount,
  currentBalance,
  onSubmit,
}: Props) => {
  const [bidAmount, setBidAmount] = useState(minBidAmount);
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-aut"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-900 shadow-xl rounded-2xl">
              <Dialog.Title
                as="h2"
                className="text-2xl font-medium leading-6 text-white"
              >
                Place a Bid
              </Dialog.Title>
              <div className="mt-4">
                <p className="text-gray-500 text-md">
                  You must bid at least{" "}
                  <span className="font-semibold text-white">
                    {minBidAmount} ETH
                  </span>
                </p>
              </div>
              <div className="mt-6 form-control">
                <label className=" input-group focus:outline-none focus:ring-none input-group-md">
                  <input
                    type="number"
                    lang="en"
                    min={minBidAmount}
                    value={bidAmount}
                    onChange={(event) =>
                      setBidAmount(String(event.target.value))
                    }
                    step="0.01"
                    className="w-full input input-lg focus:ring-0"
                  />
                  <span className="text-xl text-white bg-primary ">ETH</span>
                </label>
              </div>
              <div className="divider"></div>
              <div className="mt-4">
                <p className="text-gray-500 text-md">
                  Your balance
                  <span className="float-right font-semibold text-white">
                    {currentBalance} ETH
                  </span>
                </p>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-md">
                  Total bid amount
                  <span className="float-right font-semibold text-white">
                    {bidAmount} ETH
                  </span>
                </p>
              </div>
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  className="w-full rounded-full text-md btn btn-primary"
                  onClick={() => onSubmit(bidAmount)}
                >
                  Place a Bid
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
