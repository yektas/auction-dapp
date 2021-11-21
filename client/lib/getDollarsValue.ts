import axios from "axios";

  export default function getDollarsValue() {
    const url = 'http://api.coinlayer.com/api/live';
    console.log(process.env.NEXT_PUBLIC_COINLAYER_APIKEY);
    const params = {
      'access_key': process.env.NEXT_PUBLIC_COINLAYER_APIKEY || '',
      'symbols': 'BTC,ETH',
    }
    return axios.get(url, { params: params})
  }