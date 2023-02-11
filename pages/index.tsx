import { Button, Input } from "antd";
import { useGameContext } from "contexts/gameContext";
import React from "react";
import { useContractEvent } from "wagmi";
import ChessABI from "contracts/chessABI";
import SetupGame from "components/SetupGame";
import { useWeb3LoadingContext } from "contexts/web3Loading";
import { useGame } from "hooks/useGame";
import Game from "components/Game";

export default function Home() {
  const { game, selectGame } = useGameContext();
  const handleSubmit = () => {
    selectGame(gameAddressInput);
  };

  const { FEN } = useGame();
  const [gameAddressInput, setGameAddressInput] = React.useState<string>("");

  const { setIsWeb3Loading } = useWeb3LoadingContext();

  useContractEvent({
    address: game?.gameAddress,
    abi: ChessABI,
    eventName: "ValidateMove",
    // @ts-ignore
    listener(requestId: string, isValid: boolean) {
      console.log("MOVE MADE", requestId, isValid);
    },
  });

  useContractEvent({
    address: game?.gameAddress,
    abi: ChessABI,
    eventName: "GameReady",
    // @ts-ignore
    listener(requestId: string, isValid: boolean) {
      setIsWeb3Loading(false);
      console.log("GAME SET UP", requestId, isValid);
    },
  });

  if (!game || !game.gameAddress || game.gameAddress === "") {
    return (
      <div className="">
        <Input.Group>
          <Input
            addonBefore="Game Address"
            placeholder="Input contract address of game"
            defaultValue={game?.gameAddress}
            style={{ width: "40%" }}
            onChange={(e) => setGameAddressInput(e.target.value)}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </Input.Group>
      </div>
    );
  } else if (FEN === "") {
    return <SetupGame />;
  }
  return <Game />;
}
