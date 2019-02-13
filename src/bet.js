import web3 from './web3';
import abi from './bet.json';

// use this to connect to an instance of a bet contract by
// passing in an address
export default (address) => {
  return new web3.eth.Contract(abi,address);
};
