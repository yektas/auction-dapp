import { Contract } from "web3-eth-contract";
import { proxy } from "valtio";

interface Store {
  contract: any;
}

const store = proxy<Store>({ contract: null });

export default store;
