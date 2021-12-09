import { Contract } from "web3-eth-contract";
import { proxy } from "valtio";

interface Store {
  newProductAdded: boolean;
}

const store = proxy<Store>({ newProductAdded: false });

export default store;
