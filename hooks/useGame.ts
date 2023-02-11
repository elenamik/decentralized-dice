import { useContractRead } from "wagmi";
import ChessABI from "contracts/chessABI";
import { useGameContext } from "contexts/gameContext";

export const useGame = () => {
  const { game } = useGameContext();

  const { data: FEN } = useContractRead({
    address: game?.gameAddress,
    abi: ChessABI,
    functionName: "FEN",
    watch: true,
  }) as { data: string };
  const { data: WHITE } = useContractRead({
    address: game?.gameAddress,
    abi: ChessABI,
    functionName: "WHITE",
    watch: true,
  }) as { data: string };
  const { data: BLACK } = useContractRead({
    address: game?.gameAddress,
    abi: ChessABI,
    functionName: "BLACK",
    watch: true,
  }) as { data: string };
  const { data: TO_MOVE } = useContractRead({
    address: game?.gameAddress,
    abi: ChessABI,
    functionName: "TO_MOVE",
    watch: true,
  }) as { data: string };

  return { FEN, WHITE, BLACK, TO_MOVE };
};
