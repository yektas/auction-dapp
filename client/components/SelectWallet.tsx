import { ConnectorNames } from "../pages";

type Options = {
  onClick: Function;
};

const SelectWallet = ({ onClick }: Options) => {
  return (
    <div className="bg-gray-900 border-2 border-gray-600 shadow-lg rounded-2xl ">
      <div className="w-full px-6 pt-2 pb-8 text-center">
        <div className="flex flex-row justify-between w-full mb-2">
          <div className="py-6 text-2xl text-white ">
            <h4>Connect to a wallet</h4>
          </div>
        </div>
        <div className="flex justify-between mt-5 align-center">
          <img src="/wallet.svg" className="w-1/3" />
          <div>
            <div
              onClick={() => onClick(ConnectorNames.Metamask)}
              className="flex flex-row bg-indigo-600 rounded-lg shadow-md cursor-pointer hover:bg-indigo-700 "
            >
              <div className="flex items-center w-full ">
                <div className="flex items-center w-full">
                  <button className="w-full px-6 py-4 text-lg font-medium text-center text-white">
                    Metamask
                  </button>
                  <img src="/metamask-fox.svg" className="w-12" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mr-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div
              onClick={() => onClick(ConnectorNames.WalletConnect)}
              className="flex flex-row mt-4 bg-indigo-600 rounded-lg shadow-md cursor-pointer hover:bg-indigo-700 "
            >
              <div className="flex items-center w-full ">
                <button className="w-full px-6 py-4 text-lg font-medium text-center text-white ">
                  WalletConnect
                </button>
                <img
                  src="/walletConnect.svg"
                  className="w-12 bg-white border-none rounded-full"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mr-2 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectWallet;
