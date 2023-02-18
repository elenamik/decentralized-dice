import { Alert, Button, Input } from "antd";
import React, { useEffect } from "react";
import { useAccount, useContract, useContractEvent, useSigner } from "wagmi";

import { useWeb3LoadingContext } from "../contexts/web3Loading";
import { diceGame } from "../constants/game";
import PlayDiceABI from "../contracts/PlayDiceABI.json";
import { Game } from "../types/game";
import { useMutation } from "react-query";
import RecentGames from "../components/RecentGames";
import { PlayCircleOutlined } from "@ant-design/icons";
import Leaderboards from "../components/Leaderboards";

export default function Home() {
  const { isWeb3Loading, setIsWeb3Loading } = useWeb3LoadingContext();
  const { isConnected, address } = useAccount();
  const { data: signer } = useSigner();
  const [player2Input, setPlayer2Input] = React.useState<string>(
    "0xF207a7340103fd098908bc74Eb8174D745BAA3a6"
  ); // hardcoded to one of my test accounts
  const [gameResult, setGameResult] = React.useState<string | undefined>();
  const [canPlay, setCanPlay] = React.useState(false);

  useContractEvent({
    address: diceGame.address,
    abi: PlayDiceABI,
    eventName: "Game",
    // @ts-ignore
    listener(win: string, loss: string) {
      // filter only for your game result
      if (win === address || loss === address) {
        setIsWeb3Loading(false);
        setGameResult(win);
      }
    },
  });

  const diceContract = useContract({
    address: diceGame.address,
    abi: PlayDiceABI,
    signerOrProvider: signer,
  });

  const { mutate } = useMutation({
    mutationKey: `move${Date.now()}`,
    mutationFn: (args: { player2: string }) => {
      return diceContract!.playDice(args.player2);
    },
    onSuccess: (data) => {
      console.log("Success", data);
      setIsWeb3Loading(true);
      setGameResult(undefined);
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const handlePlay = () => {
    mutate({ player2: player2Input });
  };

  useEffect(() => {
    if (isConnected && !isWeb3Loading) setCanPlay(true);
    else setCanPlay(false);
  }, [isConnected, isWeb3Loading]);

  const GameResult = () => {
    if (gameResult === undefined) return null;
    else if (gameResult === address) {
      return (
        <Alert
          message="You won!"
          description={`Congrats, you beat ${player2Input}`}
          type="success"
          showIcon
          closable
          onClose={() => setGameResult(undefined)}
        />
      );
    } else {
      return (
        <Alert
          message="You lost!"
          style={{ width: "40%" }}
          description={`Sorry, ${gameResult} won`}
          type="error"
          showIcon
          closable
          onClose={() => setGameResult(undefined)}
        />
      );
    }
  };

  return (
    <div className="">
      <div className="flex flex-row">
        <Input
          style={{ width: "40%" }}
          disabled={!canPlay}
          addonBefore="Opponent"
          value={player2Input}
          onChange={(e) => setPlayer2Input(e.target.value)}
          placeholder="Paster your opponent's address"
        />
        <Button
          type="primary"
          shape="round"
          icon={<PlayCircleOutlined />}
          loading={isWeb3Loading}
          disabled={!canPlay}
          onClick={handlePlay}
        >
          Play Dice
        </Button>
      </div>
      <GameResult />
      <RecentGames />
      <Leaderboards />
    </div>
  );
}
