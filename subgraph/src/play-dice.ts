import { Game as GameEvent } from "../generated/PlayDice/PlayDice";
import { Game } from "../generated/schema";

export function handleGame(event: GameEvent): void {
  let game = new Game(event.transaction.hash.concatI32(event.logIndex.toI32()));
  game.win = event.params.win;
  game.loss = event.params.loss;

  game.blockNumber = event.block.number;
  game.blockTimestamp = event.block.timestamp;
  game.transactionHash = event.transaction.hash;

  game.save();
}
