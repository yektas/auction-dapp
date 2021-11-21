import Web3 from "web3";
import { AbiItem } from 'web3-utils'
import contractJson from "../../build/contracts/Auction.json";

const getContractInstance = async (web3: Web3, contractAddress: string) => {  
    // create the instance
    const instance = new web3.eth.Contract(
        contractJson.abi as AbiItem[],
        contractAddress
    )
    return instance
  }
  
  export default getContractInstance