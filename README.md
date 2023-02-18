This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Deploy graph
1. install graph-cli globally, `graph-auth` with project token, open project in subgraph studio
2. `cd subgraph-files`
3. `graph codegen` -> creates `generated` folder with generated AssemblyScript types
4. `graph build` -> creates `build` folder with compiled subgraph in WebAssembly
5. `graph deploy decentalized-dice(or your proj here)` + specify version -> check it reflects in subgraph studion