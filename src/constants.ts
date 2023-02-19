const DICE_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
if (!DICE_CONTRACT_ADDRESS)
  throw new Error("Please specify NEXT_PUBLIC_CONTRACT_ADDRESS");

// To appease type requirements in wagmi hooks
type DiceGame = {
  address: `0x${string}`;
};

export const DICE_GAME: DiceGame = { address: DICE_CONTRACT_ADDRESS };
