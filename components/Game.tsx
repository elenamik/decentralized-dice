import { Button, Input, Typography } from "antd";
import { ChessBoard } from "components/ChessBoard";
import { useGameContext } from "contexts/gameContext";
import React from "react";
import { useBalance, useContract, useContractEvent, useSigner } from "wagmi";
import ChessABI from "contracts/chessABI";
import { useWeb3LoadingContext } from "contexts/web3Loading";
import { useGame } from "hooks/useGame";
import { useMutation } from "react-query";
const { Title } = Typography;

export default function Game() {
  const { game } = useGameContext();
  const { data: signer } = useSigner();

  const { FEN, WHITE, BLACK, TO_MOVE } = useGame();
  const [moveInput, setMoveInput] = React.useState<string>("");

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
    listener(p1: string, p2: boolean) {
      setIsWeb3Loading(false);
      console.log("GAME SET UP", p1, p2);
    },
  });

  const [allowMove, setAllowMove] = React.useState<boolean>(false);
  React.useEffect(() => {
    (async () => {
      if ((await signer?.getAddress()) === TO_MOVE) {
        setAllowMove(true);
      } else {
        setAllowMove(false);
      }
    })();
  }, [signer, TO_MOVE]);
  const contract = useContract({
    address: game?.gameAddress,
    abi: ChessABI,
    signerOrProvider: signer,
    watch: true,
  });

  const { mutate, isLoading } = useMutation({
    mutationKey: `${game?.gameAddress}-move`,
    mutationFn: (args: { move: string }) => {
      console.log(args.move);
      return contract!.attemptMove(args.move);
    },
    onSuccess: (data) => {
      console.log("Success", data);
      setIsWeb3Loading(true);
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const { data: linkBal } = useBalance({
    token: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    address: game?.gameAddress,
    watch: true,
  });

  // @ts-ignore
  const funds = (parseFloat(linkBal?.value) / 10 ** 18).toFixed(6);

  const handleMove = () => {
    mutate({ move: moveInput });
  };

  return (
    <div>
      <Title level={3}>game in progress at: {game?.gameAddress} </Title>
      <Title level={4}>White: {WHITE} </Title>
      <Title level={4}>Black: {BLACK} </Title>
      <Typography>{TO_MOVE} to move</Typography>
      <Typography>Game funds (in LINK): {funds}</Typography>
      <ChessBoard fen={FEN} />
      {allowMove && (
        <Input.Group>
          <Input
            addonBefore="Move"
            placeholder="Place move"
            style={{ width: "40%" }}
            onChange={(e) => setMoveInput(e.target.value)}
          />
          <Button onClick={handleMove}>Submit</Button>
        </Input.Group>
      )}
    </div>
  );
}
