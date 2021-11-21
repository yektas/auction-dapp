import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

const RPC_URL_4 =
  "https://rinkeby.infura.io/v3/d69e76b9da894e738230b1771c35f6a4";

const RPC_URLS = {
  4: RPC_URL_4,
};

export const walletConnect = new WalletConnectConnector({
  rpc: { 4: RPC_URLS[4] },
  qrcode: true,
});
