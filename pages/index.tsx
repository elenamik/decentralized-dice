import { Alert, Button, Input, Typography } from "antd";
import React, { useEffect } from "react";
import { useAccount, useContract, useContractEvent, useSigner } from "wagmi";

import { useWeb3LoadingContext } from "../contexts/web3Loading";
import { diceGame } from "../constants/game";
import PlayDiceABI from "../subgraph/abis/PlayDice.json";
import { useMutation } from "react-query";
import RecentGames from "../components/RecentGames";
import { PlayCircleOutlined } from "@ant-design/icons";
import Leaderboards from "../components/Leaderboards";

export default function Home() {
  // app context
  const { isWeb3Loading, setIsWeb3Loading } = useWeb3LoadingContext(); // loading state for block updates
  const { isConnected, address } = useAccount();
  const { data: signer } = useSigner();

  // game state
  const [opponentInput, setOpponentInput] = React.useState<string>(
    "0xF207a7340103fd098908bc74Eb8174D745BAA3a6"
  ); // hardcoded to one of my test accounts
  const [gameResult, setGameResult] = React.useState<string | undefined>();
  const [canPlay, setCanPlay] = React.useState(false);

  // listens for events emittted by the contract to update UI
  useContractEvent({
    address: diceGame.address,
    abi: PlayDiceABI,
    eventName: "Game",
    listener(win: string, loss: string) {
      console.log("Game event", win, loss);
      // filter only for your game result
      if (win === address || loss === address) {
        setIsWeb3Loading(false);
        setGameResult(win);
      }
    },
  });

  // code to interact with contract
  const diceContract = useContract({
    address: diceGame.address,
    abi: PlayDiceABI,
    signerOrProvider: signer,
  });

  // handles play submit
  const { mutate } = useMutation({
    mutationKey: `move${Date.now()}`,
    mutationFn: (args: { opponent: string }) => {
      return diceContract!.playDice(args.opponent);
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
    mutate({ opponent: opponentInput });
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
          description={`Congrats, you beat ${opponentInput}`}
          type="success"
          showIcon
          closable
          style={{ width: "80%" }}
          onClose={() => setGameResult(undefined)}
        />
      );
    } else {
      return (
        <Alert
          message="You lost!"
          style={{ width: "80%" }}
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
      <Typography.Title level={1}>Decentralized Dice 🎲</Typography.Title>
      <div className="flex flex-row">
        <Input
          style={{ width: "40%" }}
          disabled={!canPlay}
          addonBefore="Opponent"
          value={opponentInput}
          onChange={(e) => setOpponentInput(e.target.value)}
          placeholder="Paste your opponent's address"
        />
        <Button
          type="primary"
          shape="round"
          icon={<PlayCircleOutlined />}
          loading={isWeb3Loading}
          disabled={!canPlay || opponentInput === ""}
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
