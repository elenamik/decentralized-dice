export const DICE_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!DICE_CONTRACT_ADDRESS)
  throw new Error("Please specify NEXT_PUBLIC_CONTRACT_ADDRESS");

export type DiceGame = {
  address: `0x${string}`;
};

export const diceGame: DiceGame = { address: DICE_CONTRACT_ADDRESS };
