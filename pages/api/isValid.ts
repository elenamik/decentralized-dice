// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Chess } from "chess.js";
import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { goerliProvider } from "../../services/web3";
import chessABI from "contracts/chessABI";

type Data = {
  valid: boolean;
  game: string;
  move: string;
  FEN: string;
  nextFEN?: string;
  message?: string;
};
type ErrorResponse = {
  error: string;
};

type Response = Data | ErrorResponse;
interface Body extends NextApiRequest {
  query: {
    game: string;
    move: string;
  };
}

export default async function handler(
  req: Body,
  res: NextApiResponse<Response>
) {
  console.log("RECIEVED REQUEST", req.query);
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { game, move } = req.query;

  if (!game || !move) {
    return res.status(405).json({
      error:
        "Did not recieve expected arguments. Recieved:" +
        JSON.stringify(req.body),
    });
  }

  // load game
  let FEN: string;
  try {
    const chessContract = new ethers.Contract(game, chessABI, goerliProvider);
    FEN = await chessContract.FEN();
    if (!FEN || FEN === "") {
      return res.status(501).json({ error: "Game not started" });
    }
  } catch (e) {
    console.log("ERROR LOADING FEN", JSON.stringify(e));
  }

  // check move
  const chess = new Chess(FEN!);

  let response: Response;
  try {
    chess.move(move);
    const nextFEN = chess.fen();
    response = { valid: true, game, move, nextFEN, FEN: FEN! };
  } catch (e) {
    response = {
      valid: false,
      FEN: FEN!,
      game,
      move,
      message: "Illegal move",
    };
  }

  return res.status(200).json(response);
}
