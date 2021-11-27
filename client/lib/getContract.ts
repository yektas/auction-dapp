import Web3 from "web3";
import { AbiItem } from 'web3-utils'
import contractJson from "../../build/contracts/Auction.json";
import getWeb3 from './getWeb3';

const getContractInstance = async () => {  
    const web3 = await getWeb3();
    const instance = new web3!.eth.Contract(
        contractJson.abi as AbiItem[],
        process.env.NEXT_PUBLIC_AUCTION_ADDRESS
    )
    return instance
  }
  
  export default getContractInstance