# Getting Started with Create React App

### Project created

* Create react app `npm create-react-app --template typescript`
* Init truffle `npm install truffle` and `truffle init`
* Set ENV vars:
```shell
export MNEMONIC="carry antique outdoor donate around crawl exhibit noble gallery fan island clog";
export NETWORK_ID=17000;
export PROJECT_URL=https://rpc.holesky.ethpandaops.io;
```
* Truffle compile and deploy `truffle-compile` and `truffle-deploy`
* Copy JSON contract to SRC dir `cp ./build/contracts/Lottery.json ./src/contract/contract.json`


* Network used: https://github.com/eth-clients/holesky