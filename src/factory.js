import web3 from './web3';
import abi from './factory.json'

// this is the address of the latest deployment of the contract
//change this to connect to a different deployment

const address = '0x4Cae2301310795E6711a800c94Dab77Cea8A1E2D';

const instance = new web3.eth.Contract(abi,address);

export default instance;
