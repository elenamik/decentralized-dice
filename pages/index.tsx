import { Button, Input, Spin } from "antd";
import React from "react";
import { useAccount, useContract, useContractEvent, useSigner } from "wagmi";

import { useWeb3LoadingContext } from "contexts/web3Loading";
import { diceGame } from "constants/game";
import PlayDiceABI from "contracts/PlayDiceABI.json";
import { Game } from "types/game";
import { useMutation } from "react-query";

export default function Home() {
  const { isWeb3Loading, setIsWeb3Loading } = useWeb3LoadingContext();
  const { isConnected } = useAccount();
  const [games, setGames] = React.useState<Game[]>([]);
  const { data: signer } = useSigner();
  const [player2Input, setPlayer2Input] = React.useState<string>(
    "0xF207a7340103fd098908bc74Eb8174D745BAA3a6"
  ); // hardcoded to one of my test accounts

  useContractEvent({
    address: diceGame.address,
    abi: PlayDiceABI,
    eventName: "Game",
    // @ts-ignore
    listener(win: string, loss: string) {
      setIsWeb3Loading(false);
      if (games.length > 4) {
        setGames([{ win, loss }, ...games.slice(0, -1)]);
      }
      setGames([{ win, loss }, ...games]);
    },
  });

  const diceContract = useContract({
    address: diceGame.address,
    abi: PlayDiceABI,
    signerOrProvider: signer,
  });

  const { mutate, isLoading } = useMutation({
    mutationKey: `move${Date.now()}`,
    mutationFn: (args: { player2: string }) => {
      return diceContract!.playDice(args.player2);
    },
    onSuccess: (data) => {
      console.log("Success", data);
      setIsWeb3Loading(true);
      setPlayer2Input("");
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const handlePlay = async () => {
    mutate({ player2: player2Input });
  };

  const canPlay = isConnected && !isWeb3Loading;

  return (
    <div className="">
      <Button disabled={!canPlay} onClick={handlePlay}>
        Play Dice
      </Button>
      <Input
        disabled={!canPlay}
        addonBefore="Opponent"
        value={player2Input}
        onChange={(e) => setPlayer2Input(e.target.value)}
      />

      <div>
        {isWeb3Loading && <Spin />}
        {games.map((game, index) => (
          <div key={index}>
            Win: {game.win} Loss: {game.loss}
          </div>
        ))}
      </div>
    </div>
  );
}
