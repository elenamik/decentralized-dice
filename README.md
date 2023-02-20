# 🎲🎲🎲 Decentralized Dice 🎲🎲🎲
A tutorial on how to build this project can be found [here](https://mikleens.hashnode.dev/how-to-use-the-graph-protocol-for-decentralized-gaming).
If you are following along, **run `git checkout start-here`** and continue to the below steps.

Full working version is live at [decentralized-dice.vercel.app](https://decentralized-dice.vercel.app/).

## Getting Started
- run `npm install` or `yarn install` to install dependencies
- copy `.env.sample` and rename to `.env.local`
- run `npm run dev` or `yarn dev` to start the development server
- open up `localhost:3000` in your browser, you should see an input field, and a button to connect your wallet
- connect your wallet, paste in another ETH address, and you should be enabled to roll the dice
- if following the tutorial, hop back to follow along deploying the smart contract and subgraph.

## Frontend Code
- You can find the majority of the app code in `pages/index.tsx`

## Deploying graph
1. install graph-cli globally, open project in subgraph studio, `graph-auth` with your project token
2. `cd subgraph`
3. `graph codegen` -> creates `generated` folder with generated AssemblyScript types
4. `graph build` -> creates `build` folder with compiled subgraph in WebAssembly
5. `graph deploy decentalized-dice(or your proj here)` + specify version -> check it reflects in subgraph studion