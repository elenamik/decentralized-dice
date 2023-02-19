import { Alert, Button, Input, Popover, Typography } from "antd";
import React, { useEffect } from "react";
import { useAccount, useContract, useContractEvent, useSigner } from "wagmi";
import { DICE_GAME } from "../src/constants";
import PlayDiceABI from "../subgraph/abis/PlayDice.json";
import { useMutation } from "react-query";
import RecentGames from "../src/components/RecentGames";
import { PlayCircleOutlined } from "@ant-design/icons";
import Leaderboards from "../src/components/Leaderboards";
import { ethers } from "ethers";

export default function Home() {
  // app context
  const [isWaitingForBlock, setIsWaitingForBlock] =
    React.useState<boolean>(false);
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
    address: DICE_GAME.address,
    abi: PlayDiceABI,
    eventName: "Game",
    listener(win: string, loss: string) {
      console.log("Game event", win, loss);
      // filter only for your game result
      if (win === address || loss === address) {
        setIsWaitingForBlock(false);
        setGameResult(win);
      }
    },
  });

  // code to interact with contract
  const diceContract = useContract({
    address: DICE_GAME.address,
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
      setIsWaitingForBlock(true);
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
    if (isConnected && !isWaitingForBlock) setCanPlay(true);
    else setCanPlay(false);
  }, [isConnected, isWaitingForBlock]);

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
        <Popover
          content="Please put in valid ETH address"
          title="Address invalid"
          open={!ethers.utils.isAddress(opponentInput)}
        >
          <Input
            style={{ width: "40%" }}
            disabled={!canPlay}
            addonBefore="Opponent"
            value={opponentInput}
            onChange={(e) => setOpponentInput(e.target.value)}
            placeholder="Paste your opponent's address"
          />
        </Popover>

        <Button
          type="primary"
          shape="round"
          icon={<PlayCircleOutlined />}
          loading={isWaitingForBlock}
          disabled={
            !canPlay ||
            opponentInput === "" ||
            !ethers.utils.isAddress(opponentInput)
          }
          onClick={handlePlay}
        >
          Play Dice
        </Button>
      </div>
      <GameResult />
    </div>
  );
}
