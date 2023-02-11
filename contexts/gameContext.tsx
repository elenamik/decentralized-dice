import React from "react";

type GameState = {
  gameAddress: string;
};

const getContractAddress = () => {
  console.log(
    "env",
    process.env.NODE_ENV,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  );
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  )
    return process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  else return "";
};

const GameContext = React.createContext<GameState | any>({});

export const GameProvider: React.FC<React.ProviderProps<any>> = ({
  children,
}) => {
  const [game, setGame] = React.useState<GameState | undefined>({
    gameAddress: getContractAddress(),
  });

  const selectGame = (gameAddress: string) => {
    setGame({ gameAddress: gameAddress });
  };

  return (
    <GameContext.Provider
      value={{ game, setGame: setGame, selectGame: selectGame }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => React.useContext(GameContext);
