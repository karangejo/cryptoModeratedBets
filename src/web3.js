import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // in the browser and have metamask running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // we are on the server or the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/aa4c2d08dec54d34b66be3930e569af3'
  );

  web3 = new Web3(provider);
}

export default web3;
