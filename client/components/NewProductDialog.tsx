import { useState, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Web3 from "web3";
import { useWallet } from "use-wallet";
import { getContract } from "../lib/blockchainService";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface ProductForm {
  name: string;
  description: string;
  expireTime?: number;
  price?: number;
}

export const NewProductDialog = ({ open, onClose }: Props) => {
  const wallet = useWallet();
  const [inputs, setInputs] = useState<Partial<ProductForm>>({
    name: "",
    description: "",
  });
  const handleChange = useCallback(
    ({ target }) =>
      setInputs((_state) => {
        return {
          ..._state,
          [target.name]: target.value,
        };
      }),
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contract = await getContract();
    const estimatedGas = await contract!.methods
      .addProduct(
        inputs.name,
        `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/1024/768`,
        inputs.description,
        Web3.utils.toWei(inputs.price!.toString(), "ether"),
        inputs.expireTime
      )
      .estimateGas();

    const result = await contract!.methods
      .addProduct(
        inputs.name,
        `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/1024/768`,
        inputs.description,
        Web3.utils.toWei(inputs.price!.toString(), "ether"),
        inputs.expireTime
      )
      .send({
        from: wallet.account,
        gasPrice: estimatedGas,
      });
    if (result.status) {
      onClose();
    }
  };
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
                Add a new product
              </Dialog.Title>
              <form onSubmit={handleSubmit}>
                <div className="mt-6 form-control">
                  <label className="label">
                    <span className="text-gray-500 text-md">Product Name</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={inputs.name}
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="text-gray-500 text-md">Description</span>
                  </label>
                  <textarea
                    required
                    name="description"
                    onChange={handleChange}
                    value={inputs.description}
                    className="h-24 textarea"
                  ></textarea>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="text-gray-500 text-md">Auction Time</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="360"
                    required
                    name="expireTime"
                    onChange={handleChange}
                    value={inputs.expireTime}
                    placeholder="in minutes (max 6 hours)"
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="text-gray-500 label-text">Price</span>
                  </label>
                  <label className="input-group focus:outline-none focus:ring-none input-group-md">
                    <input
                      type="number"
                      lang="en"
                      onChange={handleChange}
                      name="price"
                      value={inputs.price}
                      step="0.01"
                      className="w-full border-none input input-lg focus:ring-0"
                    />
                    <span className="text-xl text-white bg-primary ">ETH</span>
                  </label>
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    type="submit"
                    className="w-full rounded-full text-md btn btn-primary"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
