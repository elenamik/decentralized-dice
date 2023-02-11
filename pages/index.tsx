import { Button, Input } from "antd";
import React from "react";
import { useContractEvent } from "wagmi";
import { useWeb3LoadingContext } from "contexts/web3Loading";
import { diceGame } from "constants/game";
import { PlayDiceABI } from "contracts/PlayDiceABI";

export default function Home() {
  const { setIsWeb3Loading } = useWeb3LoadingContext();

  useContractEvent({
    address: diceGame?.address,
    abi: PlayDiceABI,
    eventName: "Game",
    // @ts-ignore
    listener(requestId: string, isValid: boolean) {
      console.log("MOVE MADE", requestId, isValid);
    },
  });
  return <div>hi</div>;

  // if (!game || !game.gameAddress || game.gameAddress === "") {
  //   return (
  //     <div className="">
  //       <Input.Group>
  //         <Input
  //           addonBefore="Game Address"
  //           placeholder="Input contract address of game"
  //           defaultValue={game?.gameAddress}
  //           style={{ width: "40%" }}
  //           onChange={(e) => setGameAddressInput(e.target.value)}
  //         />
  //         <Button onClick={handleSubmit}>Submit</Button>
  //       </Input.Group>
  //     </div>
  //   );
  // } else if (FEN === "") {
  //   return <SetupGame />;
  // }
  // return <Game />;
}
