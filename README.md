# 🎲🎲🎲 Decentralized Dice 🎲🎲🎲
The complete result is in the `main` branch, but if you wish to follow along,
with the walkthrough, you can check out the `start-here` branch and continue to the below steps.

## Getting Started
- run `npm install` or `yarn install` to install dependencies
- run `npm run dev` or `yarn dev` to start the development server
- open up `localhost:3000` in your browser, you should see an input field, and a button to connect your wallet
- connect your wallet, paste in another ETH address, and you should be enabled to roll the dice
- if following the tutorial, hop back to follow along deploying the smart contract and subgraph.

```bash
npm run dev
# or
yarn dev
```

## Deploying graph
1. install graph-cli globally, open project in subgraph studio, `graph-auth` with your project token
2. `cd subgraph`
3. `graph codegen` -> creates `generated` folder with generated AssemblyScript types
4. `graph build` -> creates `build` folder with compiled subgraph in WebAssembly
5. `graph deploy decentalized-dice(or your proj here)` + specify version -> check it reflects in subgraph studion