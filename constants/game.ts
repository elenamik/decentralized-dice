const getContractAddress = (): `0x${string}` => {
  if (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
    return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  else throw Error("Please specify NEXT_PUBLIC_CONTRACT_ADDRESS");
};

export type DiceGame = {
  address: `0x${string}`;
};

export const diceGame: DiceGame = { address: getContractAddress() };
