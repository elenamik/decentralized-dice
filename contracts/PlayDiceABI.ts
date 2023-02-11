export const PlayDiceABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "win",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "loss",
        type: "address",
      },
    ],
    name: "Game",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "player2",
        type: "address",
      },
    ],
    name: "playDice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
