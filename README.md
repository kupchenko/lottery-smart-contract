# Lottery smart contract 

### Project setup

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
    > Make sure `network` is set correctly with `address` and `transactionHash`
* Network used: https://github.com/eth-clients/holesky

### Tailwind

* Add tailwind `npm install tailwindcss`
* Add to `App.css`
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
* Add `./tailwind.coonfig.js`
    ```javascript
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./src/**/*.{js,jsx,ts,tsx}",
      ],
      theme: {},
      plugins: [],
    }
    ```

### ShadCn

* ShadCN was init with `npx shadcn-ui@latest init`
* Add ShadCn components `npx shadcn-ui@latest add button`